
import { User, Patient, Doctor, Appointment } from './types';
import { MOCK_PATIENTS, MOCK_APPOINTMENTS, MOCK_DOCTORS } from './constants';

/**
 * HEALSYNC PRODUCTION BRIDGE
 * Switch between simulated LocalStorage and a real Remote API.
 */

const DB_VERSION = 'v11-prod';
const LATENCY = 400;

// Change this to your real production URL when you have it
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
      localStorage.setItem(this.KEYS.USERS, JSON.stringify([
        { id: 'u1', email: 'admin@healsync.com', name: 'Super Admin', role: 'admin', passwordHash: adminHash }
      ]));
      localStorage.setItem(this.KEYS.PATIENTS, JSON.stringify(MOCK_PATIENTS));
      localStorage.setItem(this.KEYS.DOCTORS, JSON.stringify(MOCK_DOCTORS));
      localStorage.setItem(this.KEYS.APPOINTMENTS, JSON.stringify(MOCK_APPOINTMENTS));
    }
  }

  // --- UNIVERSAL REQUEST HANDLER (REAL OR VIRTUAL) ---

  static async request<T>(method: string, endpoint: string, payload?: any): Promise<ApiResponse<T>> {
    const token = localStorage.getItem(this.KEYS.TOKEN);
    
    // IF WE HAVE A REAL REMOTE API CONFIGURED
    if (REMOTE_API_URL) {
      try {
        const response = await fetch(`${REMOTE_API_URL}${endpoint}`, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
          },
          body: payload ? JSON.stringify(payload) : undefined
        });
        const data = await response.json();
        Logger.add(method, endpoint, response.status, payload);
        return { status: response.status, data, timestamp: new Date().toISOString() };
      } catch (error) {
        Logger.add(method, endpoint, 500, { error: 'Network failure' });
        return { status: 500, message: 'Remote server unreachable', timestamp: new Date().toISOString() };
      }
    }

    // FALLBACK TO VIRTUAL ENGINE (FOR DEVELOPMENT)
    await new Promise(r => setTimeout(r, LATENCY));
    let status = 200;
    let data: any = null;

    if (method === 'GET') {
      if (endpoint.includes('/patients')) data = this.getTable(this.KEYS.PATIENTS);
      else if (endpoint.includes('/doctors')) data = this.getTable(this.KEYS.DOCTORS);
      else if (endpoint.includes('/appointments')) data = this.getTable(this.KEYS.APPOINTMENTS);
      else if (endpoint.includes('/system/logs')) data = Logger.getLogs();
    } 
    else if (method === 'POST') {
      if (endpoint === '/api/auth/login') {
        const users = this.getTable<any>(this.KEYS.USERS);
        const hash = await hashPassword(payload.password);
        const user = users.find(u => u.email === payload.email && u.passwordHash === hash);
        if (user) {
          const { passwordHash, ...safeUser } = user;
          data = { user: safeUser, token: 'v_jwt_token_' + Math.random() };
          localStorage.setItem(this.KEYS.TOKEN, data.token);
        } else { status = 401; }
      }
    }

    Logger.add(method, endpoint, status, payload);
    return { status, data, timestamp: new Date().toISOString() };
  }

  // --- INTERNAL STORAGE HELPERS ---
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
