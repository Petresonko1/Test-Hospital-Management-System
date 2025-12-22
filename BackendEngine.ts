
import { User, Patient, Doctor, Appointment } from './types';
import { MOCK_PATIENTS, MOCK_APPOINTMENTS, MOCK_DOCTORS } from './constants';

/**
 * HEALSYNC STABLE VIRTUAL ENGINE
 * Data is persisted in localStorage with permanent keys.
 */

const STORAGE_PREFIX = 'healsync_v1_';
const LATENCY = 200;

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
    INIT: `${STORAGE_PREFIX}initialized`,
    USERS: `${STORAGE_PREFIX}users`,
    PATIENTS: `${STORAGE_PREFIX}patients`,
    DOCTORS: `${STORAGE_PREFIX}doctors`,
    APPOINTMENTS: `${STORAGE_PREFIX}appointments`,
    TOKEN: `${STORAGE_PREFIX}session_token`
  };

  static async initialize() {
    if (!localStorage.getItem(this.KEYS.INIT)) {
      const adminHash = await hashPassword('password123');
      const docHash = await hashPassword('password123');
      const patHash = await hashPassword('password123');

      this.saveTable(this.KEYS.USERS, [
        { id: 'u1', email: 'admin@healsync.com', name: 'Super Admin', role: 'admin', passwordHash: adminHash },
        { id: 'u2', email: 'doctor@healsync.com', name: 'Dr. Sarah Wilson', role: 'doctor', passwordHash: docHash },
        { id: 'u3', email: 'patient@healsync.com', name: 'John Doe', role: 'patient', passwordHash: patHash }
      ]);
      
      this.saveTable(this.KEYS.PATIENTS, MOCK_PATIENTS);
      this.saveTable(this.KEYS.DOCTORS, MOCK_DOCTORS);
      this.saveTable(this.KEYS.APPOINTMENTS, MOCK_APPOINTMENTS);
      
      localStorage.setItem(this.KEYS.INIT, 'true');
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
      // Robust ID extraction: filter empty segments from split to handle trailing slashes
      const segments = endpoint.split('/').filter(Boolean);
      const id = segments[segments.length - 1];
      
      let table = this.getTable<any>(tableKey);
      const originalLength = table.length;
      table = table.filter(item => item.id !== id);
      
      if (table.length < originalLength) {
        this.saveTable(tableKey, table);
        data = { success: true };
      } else { 
        status = 404; 
      }
    }

    Logger.add(method, endpoint, status, payload);
    return { status, data, timestamp: new Date().toISOString() };
  }

  private static getTable<T>(key: string): T[] {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : [];
    } catch {
      return [];
    }
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

  static getSessionTokenKey() {
    return this.KEYS.TOKEN;
  }
}
