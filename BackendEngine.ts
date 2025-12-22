
import { User, Patient, Doctor, Appointment } from './types';
import { MOCK_PATIENTS, MOCK_APPOINTMENTS, MOCK_DOCTORS } from './constants';

/**
 * HEALSYNC CORE VIRTUAL ENGINE (Production Simulation)
 */

const DB_VERSION = 'v12-final';
const LATENCY = 300;

const REMOTE_API_URL = (window as any).process?.env?.VITE_API_URL || null;

export type ApiResponse<T> = {
  status: number;
  data?: T;
  message?: string;
  timestamp: string;
};

export type ServerLog = {
  method: string;
  url: string;
  status: number;
  payload?: any;
  timestamp: string;
};

class Logger {
  private static logs: ServerLog[] = [];
  static add(method: string, url: string, status: number, payload?: any) {
    this.logs.unshift({ method, url, status, payload, timestamp: new Date().toLocaleTimeString() });
    if (this.logs.length > 50) this.logs.pop();
  }
  static getLogs() { return this.logs; }
}

export async function hashPassword(password: string): Promise<string> {
  const salt = "healsync_prod_salt_2024";
  const msgUint8 = new TextEncoder().encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export class VirtualDB {
  private static KEYS = {
    USERS: `hs_users_${DB_VERSION}`,
    PATIENTS: `hs_patients_${DB_VERSION}`,
    DOCTORS: `hs_doctors_${DB_VERSION}`,
    APPOINTMENTS: `hs_appointments_${DB_VERSION}`,
    TOKEN: `hs_session_token_${DB_VERSION}`
  };

  static async initialize() {
    if (!localStorage.getItem(this.KEYS.USERS)) {
      const adminHash = await hashPassword('password123');
      const docHash = await hashPassword('password123');
      const patHash = await hashPassword('password123');

      localStorage.setItem(this.KEYS.USERS, JSON.stringify([
        { id: 'u1', email: 'admin@healsync.com', name: 'Super Admin', role: 'admin', passwordHash: adminHash },
        { id: 'u2', email: 'doctor@healsync.com', name: 'Dr. Sarah Wilson', role: 'doctor', passwordHash: docHash },
        { id: 'u3', email: 'patient@healsync.com', name: 'John Doe', role: 'patient', passwordHash: patHash }
      ]));
      localStorage.setItem(this.KEYS.PATIENTS, JSON.stringify(MOCK_PATIENTS));
      localStorage.setItem(this.KEYS.DOCTORS, JSON.stringify(MOCK_DOCTORS));
      localStorage.setItem(this.KEYS.APPOINTMENTS, JSON.stringify(MOCK_APPOINTMENTS));
    }
  }

  static async request<T>(method: string, endpoint: string, payload?: any): Promise<ApiResponse<T>> {
    const token = localStorage.getItem(this.KEYS.TOKEN);
    
    if (REMOTE_API_URL) {
      try {
        const response = await fetch(`${REMOTE_API_URL}${endpoint}`, {
          method,
          headers: { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' },
          body: payload ? JSON.stringify(payload) : undefined
        });
        const data = await response.json();
        Logger.add(method, endpoint, response.status, payload);
        return { status: response.status, data, timestamp: new Date().toISOString() };
      } catch (error) {
        return { status: 500, message: 'Server unreachable', timestamp: new Date().toISOString() };
      }
    }

    // VIRTUAL ENGINE IMPLEMENTATION
    await new Promise(r => setTimeout(r, LATENCY));
    let status = 200;
    let data: any = null;

    const tableKey = endpoint.includes('/patients') ? this.KEYS.PATIENTS :
                    endpoint.includes('/doctors') ? this.KEYS.DOCTORS :
                    endpoint.includes('/appointments') ? this.KEYS.APPOINTMENTS :
                    endpoint.includes('/users') ? this.KEYS.USERS : null;

    if (method === 'GET') {
      if (endpoint === '/api/system/logs') data = Logger.getLogs();
      else if (tableKey) data = this.getTable(tableKey);
    } 
    else if (method === 'POST') {
      if (endpoint === '/api/auth/login') {
        const users = this.getTable<any>(this.KEYS.USERS);
        const hash = await hashPassword(payload.password);
        const user = users.find(u => u.email === payload.email && u.passwordHash === hash);
        if (user) {
          const { passwordHash, ...safeUser } = user;
          data = { user: safeUser, token: 'v_jwt_' + Math.random().toString(36).substring(7) };
          localStorage.setItem(this.KEYS.TOKEN, data.token);
        } else { status = 401; }
      } 
      else if (endpoint === '/api/auth/register') {
        const users = this.getTable<any>(this.KEYS.USERS);
        const hash = await hashPassword(payload.password);
        const newUser = { id: 'U' + Math.random().toString(36).substring(7), ...payload, passwordHash: hash };
        users.push(newUser);
        this.saveTable(this.KEYS.USERS, users);
        const { passwordHash, ...safeUser } = newUser;
        data = safeUser;
      }
      else if (tableKey) {
        const table = this.getTable<any>(tableKey);
        const newItem = { id: (tableKey === this.KEYS.PATIENTS ? 'P' : tableKey === this.KEYS.DOCTORS ? 'D' : 'A') + Math.floor(1000 + Math.random() * 9000), ...payload };
        table.push(newItem);
        this.saveTable(tableKey, table);
        data = newItem;
      }
    }
    else if (method === 'PUT' && tableKey) {
      const table = this.getTable<any>(tableKey);
      const index = table.findIndex(item => item.id === payload.id);
      if (index !== -1) {
        table[index] = { ...table[index], ...payload };
        this.saveTable(tableKey, table);
        data = table[index];
      } else { status = 404; }
    }
    else if (method === 'DELETE' && tableKey) {
      const id = endpoint.split('/').pop();
      let table = this.getTable<any>(tableKey);
      const originalLength = table.length;
      table = table.filter(item => item.id !== id);
      if (table.length < originalLength) {
        this.saveTable(tableKey, table);
        data = { success: true };
      } else { status = 404; }
    }

    Logger.add(method, endpoint, status, payload);
    return { status, data, timestamp: new Date().toISOString() };
  }

  private static getTable<T>(key: string): T[] {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }
  private static saveTable<T>(key: string, data: T[]) {
    localStorage.setItem(key, JSON.stringify(data));
  }
  static getFullDump() {
    return {
      users: this.getTable(this.KEYS.USERS),
      patients: this.getTable(this.KEYS.PATIENTS),
      doctors: this.getTable(this.KEYS.DOCTORS),
      appointments: this.getTable(this.KEYS.APPOINTMENTS)
    };
  }
}
