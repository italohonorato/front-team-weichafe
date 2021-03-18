import { Role } from './role';

export interface User {
    uid: string;
    name: string;
    lastName: string;
    email: string;
    rut: number;
    dv: string;
    dob?: Date;
    role?: Role;
}
