/**
 * HEALSYNC UTILITY ENGINE
 */

export async function hashPassword(password: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Interface for system logs tracking
export interface ServerLog {
  method: string;
  url: string;
  status: number;
  time?: string;
}

// Mock database and network monitoring service
export const VirtualDB = {
  getFullDump: () => {
    return {
      instance: "HealSync-Primary-Node",
      region: "us-east-1",
      storage_engine: "InnoDB (Virtual)",
      active_connections: 5,
      last_sync: new Date().toISOString()
    };
  },
  request: async <T>(method: string, url: string): Promise<{ status: number; data: T }> => {
    // Simulate system logs for the dashboard
    if (url === '/api/system/logs') {
      const mockLogs: ServerLog[] = [
        { method: 'GET', url: '/api/patients', status: 200 },
        { method: 'POST', url: '/api/auth/login', status: 200 },
        { method: 'GET', url: '/api/doctors', status: 200 },
        { method: 'PUT', url: '/api/patients/P001', status: 200 },
        { method: 'GET', url: '/api/appointments', status: 200 }
      ];
      return {
        status: 200,
        data: mockLogs as unknown as T
      };
    }
    return { status: 404, data: null as unknown as T };
  }
};