
import { Patient, Appointment, Doctor, User } from './types';

// The SHA-256 hash for "password123" is ef92b778bafe771e89245b89ec8c19171e774482e9e993ef465453664327a14d
export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    email: 'admin@healsync.com',
    name: 'Super Admin',
    role: 'admin',
    passwordHash: 'ef92b778bafe771e89245b89ec8c19171e774482e9e993ef465453664327a14d'
  },
  {
    id: 'u2',
    email: 'doctor@healsync.com',
    name: 'Dr. Sarah Wilson',
    role: 'doctor',
    passwordHash: 'ef92b778bafe771e89245b89ec8c19171e774482e9e993ef465453664327a14d'
  },
  {
    id: 'u3',
    email: 'patient@healsync.com',
    name: 'John Doe',
    role: 'patient',
    passwordHash: 'ef92b778bafe771e89245b89ec8c19171e774482e9e993ef465453664327a14d'
  }
];

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'P001',
    name: 'John Doe',
    age: 45,
    gender: 'Male',
    bloodGroup: 'O+',
    status: 'Stable',
    room: '302A',
    admissionDate: '2024-03-10',
    condition: 'Post-operative recovery',
    doctor: 'Dr. Sarah Wilson',
    history: [
      { date: '2024-03-10', diagnosis: 'Appendicitis', treatment: 'Appendectomy', doctor: 'Dr. Sarah Wilson' }
    ]
  },
  {
    id: 'P002',
    name: 'Jane Smith',
    age: 32,
    gender: 'Female',
    bloodGroup: 'A-',
    status: 'Critical',
    room: 'ICU-1',
    admissionDate: '2024-03-12',
    condition: 'Acute Respiratory Distress',
    doctor: 'Dr. Michael Chen',
    history: []
  },
  {
    id: 'P003',
    name: 'Robert Brown',
    age: 68,
    gender: 'Male',
    bloodGroup: 'B+',
    status: 'In Treatment',
    room: '205B',
    admissionDate: '2024-03-08',
    condition: 'Diabetes Complications',
    doctor: 'Dr. Emily Blunt',
    history: []
  }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'A001',
    patientId: 'P001',
    patientName: 'John Doe',
    doctorName: 'Dr. Sarah Wilson',
    department: 'Surgery',
    date: '2024-03-15',
    time: '10:00 AM',
    status: 'Scheduled'
  },
  {
    id: 'A002',
    patientId: 'P002',
    patientName: 'Jane Smith',
    doctorName: 'Dr. Michael Chen',
    department: 'Cardiology',
    date: '2024-03-15',
    time: '02:30 PM',
    status: 'Scheduled'
  }
];

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'D001',
    name: 'Dr. Sarah Wilson',
    specialty: 'General Surgeon',
    experience: '12 Years',
    availability: 'Mon, Wed, Fri',
    image: 'https://picsum.photos/seed/doctor1/200/200'
  },
  {
    id: 'D002',
    name: 'Dr. Michael Chen',
    specialty: 'Cardiologist',
    experience: '15 Years',
    availability: 'Tue, Thu, Sat',
    image: 'https://picsum.photos/seed/doctor2/200/200'
  },
  {
    id: 'D003',
    name: 'Dr. Emily Blunt',
    specialty: 'Endocrinologist',
    experience: '8 Years',
    availability: 'Mon, Tue, Wed',
    image: 'https://picsum.photos/seed/doctor3/200/200'
  }
];