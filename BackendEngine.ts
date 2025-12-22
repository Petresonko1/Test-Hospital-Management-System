
import { User, Patient, Doctor, Appointment } from './types';
import { MOCK_PATIENTS, MOCK_APPOINTMENTS, MOCK_DOCTORS } from './constants';

/**
 * HEALSYNC CORE VIRTUAL ENGINE (Production Simulation)
 * This engine simulates a real Node.js/Express server + PostgreSQL database.
 */

const DB_VERSION = 'v10-prod-ready';
const LATENCY = 400; // Simulated ms delay

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

      const initialUsers = [
        { id: 'u1', email: 'admin@healsync.com', name: 'Super Admin', role: 'admin', passwordHash: adminHash },
        { id: 'u2', email: 'doctor@healsync.com', name: 'Dr. Sarah Wilson', role: 'doctor', passwordHash: docHash },
        { id: 'u3', email: 'patient@healsync.com', name: 'John Doe', role: 'patient', passwordHash: patHash }
      ];

      localStorage.setItem(this.KEYS.USERS, JSON.stringify(initialUsers));
      localStorage.setItem(this.KEYS.PATIENTS, JSON.stringify(MOCK_PATIENTS));
      localStorage.setItem(this.KEYS.DOCTORS, JSON.stringify(MOCK_DOCTORS));
      localStorage.setItem(this.KEYS.APPOINTMENTS, JSON.stringify(MOCK_APPOINTMENTS));
    }
  }

  // --- MOCK REST API ENDPOINTS ---

  static async post<T>(endpoint: string, payload: any): Promise<ApiResponse<T>> {
    await new Promise(r => setTimeout(r, LATENCY));
    let status = 200;
    let data: any = null;

    if (endpoint === '/api/auth/login') {
      const users = this.getTable<any>(this.KEYS.USERS);
      const hash = await hashPassword(payload.password);
      const user = users.find(u => u.email === payload.email && u.passwordHash === hash);
      
      if (user) {
        const { passwordHash, ...safeUser } = user;
        data = { user: safeUser, token: `jwt_${Math.random().toString(36).substr(2)}` };
        localStorage.setItem(this.KEYS.TOKEN, data.token);
      } else {
        status = 401;
      }
    }

    if (endpoint === '/api/auth/register') {
      const users = this.getTable<any>(this.KEYS.USERS);
      const hash = await hashPassword(payload.password);
      const newUser = {
        id: `U${Math.random().toString(36).substr(2, 6)}`,
        name: payload.name,
        email: payload.email,
        role: payload.role,
        passwordHash: hash
      };
      users.push(newUser);
      this.saveTable(this.KEYS.USERS, users);
      const { passwordHash, ...safeUser } = newUser;
      data = safeUser;
    }

    Logger.add('POST', endpoint, status, payload);
    return { status, data, timestamp: new Date().toISOString() };
  }

  static async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    await new Promise(r => setTimeout(r, LATENCY));
    let status = 200;
    let data: any = null;

    if (endpoint.startsWith('/api/patients')) data = this.getTable(this.KEYS.PATIENTS);
    if (endpoint.startsWith('/api/doctors')) data = this.getTable(this.KEYS.DOCTORS);
    if (endpoint.startsWith('/api/appointments')) data = this.getTable(this.KEYS.APPOINTMENTS);
    if (endpoint === '/api/system/logs') data = Logger.getLogs();

    Logger.add('GET', endpoint, status);
    return { status, data, timestamp: new Date().toISOString() };
  }

  // --- INTERNAL HELPER METHODS ---

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
