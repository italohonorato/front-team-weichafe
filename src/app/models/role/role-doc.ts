import { DocumentReference } from '@angular/fire/firestore';
import { Role } from 'src/app/interfaces/role';

export class RoleDoc {
    id: string;
    data: Role;
    ref: DocumentReference;
}
