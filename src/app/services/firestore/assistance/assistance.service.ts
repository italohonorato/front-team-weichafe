import { Injectable } from '@angular/core';
import { AngularFirestore, Action, DocumentSnapshot, DocumentChangeAction } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Assistance } from 'src/app/interfaces/assistance';
import { User } from 'src/app/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AssistanceService {

  private assistanceRef = this.fireStore.collection('assistances');

  constructor(private fireStore: AngularFirestore) { }

  async createAssistance(asistencia: Assistance): Promise<string> {
    try {
      const docRef = await this.assistanceRef.add(asistencia);
      return docRef.id;
    } catch (error) {
      console.log(`UsersService::createUser Error -> ${error}`);
      return error;
    }
  }

  getAssistance(documentId: string): Observable<Action<DocumentSnapshot<unknown>>> {
    try {
      return this.assistanceRef.doc(documentId).snapshotChanges();
    } catch (error) {
      console.log(`UsersService::getUser Error -> ${error}`);
      return error;
    }
  }

  getAssistanceByDateAndSection(assistanceDate: string, section: string): Observable<DocumentChangeAction<unknown>[]> {
    try {
      return this.fireStore.collection('assistances',
        ref => ref.where('assistance_date', '==', assistanceDate).where('section', '==', section))
        .snapshotChanges();
    } catch (error) {
      console.log(`AssistanceService::getAssistanceByDateAndSection Error -> ${error}`);
      return error;
    }
  }
}
