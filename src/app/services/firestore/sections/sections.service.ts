import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, DocumentChangeAction } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SectionsService {

  private sectionsRef = this.fireStore.collection('sections');

  constructor(private fireStore: AngularFirestore) { }

  getSectionById(documentId: string): AngularFirestoreDocument<unknown> {
    try {
      return this.sectionsRef.doc(documentId);
      // return this.rolesRef.doc(documentId).snapshotChanges();
    } catch (error) {
      console.log(`RolesService::getSectionById Error -> ${error}`);
      return error;
    }
  }

  getAllSections(): Observable<DocumentChangeAction<unknown>[]> {
    try {
      return this.sectionsRef.snapshotChanges();
    } catch (error) {
      console.log(`RolesService::getAllSections Error -> ${error}`);
      return error;
    }
  }
}
