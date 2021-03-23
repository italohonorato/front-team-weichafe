import { User } from "./user";



export interface Assistance {
    assistance_date: string;
    section: string;
    user_list: User[];
}
