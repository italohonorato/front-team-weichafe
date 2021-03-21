import { User } from 'src/app/interfaces/user';
import { RoleDoc } from '../role/role-doc';

export class UserDoc {
    position: number;
    id: string;
    data: User;
    roleDoc?: RoleDoc;
}
