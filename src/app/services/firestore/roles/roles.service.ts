import { Injectable } from '@angular/core';
import { Action, AngularFirestore, AngularFirestoreDocument, DocumentChangeAction, DocumentSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Role } from 'src/app/interfaces/role';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private rolesRef = this.fireStore.collection('roles');

  constructor(private fireStore: AngularFirestore) { }

  getRol(documentId: string): Observable<Action<DocumentSnapshot<unknown>>> {
    try {
      return this.rolesRef.doc(documentId).snapshotChanges();
    } catch (error) {
      console.log(`RolesService::getRol Error -> ${error}`);
      return error;
    }
  }

  getAllRoles(): Observable<DocumentChangeAction<unknown>[]> {
    try {
      return this.rolesRef.snapshotChanges();
    } catch (error) {
      console.log(`RolesService::getAllRoles Error -> ${error}`);
      return error;
    }
  }
}
