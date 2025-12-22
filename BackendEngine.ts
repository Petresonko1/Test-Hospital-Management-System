
import { User, Patient, Doctor, Appointment } from './types';
import { MOCK_PATIENTS, MOCK_APPOINTMENTS, MOCK_DOCTORS } from './constants';

/**
 * HEALSYNC VIRTUAL BACKEND ENGINE
 * This file simulates a real backend server and database.
 */

const DB_VERSION = 'v8-secure';
const STORAGE_KEYS = {
  USERS: `healsync_users_${DB_VERSION}`,
  PATIENTS: `healsync_patients_${DB_VERSION}`,
  DOCTORS: `healsync_doctors_${DB_VERSION}`,
  APPOINTMENTS: `healsync_appointments_${DB_VERSION}`,
};

// Simple SHA-256 Hashing using SubtleCrypto
export async function hashPassword(password: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export class VirtualDB {
  static async initialize() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      const adminHash = await hashPassword('password123');
      const docHash = await hashPassword('password123');
      const patHash = await hashPassword('password123');

      const initialUsers = [
        { id: 'u1', email: 'admin@healsync.com', name: 'Super Admin', role: 'admin', passwordHash: adminHash },
        { id: 'u2', email: 'doctor@healsync.com', name: 'Dr. Sarah Wilson', role: 'doctor', passwordHash: docHash },
        { id: 'u3', email: 'patient@healsync.com', name: 'John Doe', role: 'patient', passwordHash: patHash }
      ];

      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(MOCK_PATIENTS));
      localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(MOCK_DOCTORS));
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(MOCK_APPOINTMENTS));
    }
  }

  static getTable<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  static saveTable<T>(key: string, data: T[]) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Auth Operations
  static async authenticate(email: string, pass: string): Promise<any | null> {
    const users = this.getTable<any>(STORAGE_KEYS.USERS);
    const targetHash = await hashPassword(pass);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === targetHash);
    if (!user) return null;
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  static async registerUser(userData: any): Promise<any> {
    const users = this.getTable<any>(STORAGE_KEYS.USERS);
    const passwordHash = await hashPassword(userData.password);
    const newUser = {
      id: `U${Math.random().toString(36).substr(2, 9)}`,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      passwordHash
    };
    users.push(newUser);
    this.saveTable(STORAGE_KEYS.USERS, users);
    return newUser;
  }

  static dump() {
    return {
      users: this.getTable(STORAGE_KEYS.USERS),
      patients: this.getTable(STORAGE_KEYS.PATIENTS),
      doctors: this.getTable(STORAGE_KEYS.DOCTORS),
      appointments: this.getTable(STORAGE_KEYS.APPOINTMENTS),
    };
  }
}
