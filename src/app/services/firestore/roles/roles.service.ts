import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, DocumentChangeAction } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Role } from 'src/app/interfaces/role';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private rolesRef = this.fireStore.collection('roles');

  constructor(private fireStore: AngularFirestore) { }

  getRol(documentId: string): AngularFirestoreDocument<unknown> {
    try {
      return this.rolesRef.doc(documentId);
      // return this.rolesRef.doc(documentId).snapshotChanges();
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

  getRoleByName(roleName: string): Observable<DocumentChangeAction<unknown>[]> {
    try {
      return this.fireStore.collection('roles', ref => ref.where('roleName', '==', roleName)).snapshotChanges();
    } catch (error) {
      console.log(`RolesService::getAllRoles Error -> ${error}`);
      return error;
    }
  }
}
