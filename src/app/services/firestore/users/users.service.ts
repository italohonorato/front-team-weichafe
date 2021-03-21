import { Injectable } from '@angular/core';
import { Action, AngularFirestore, AngularFirestoreCollection, DocumentChangeAction, DocumentData, DocumentSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private userRef = this.fireStore.collection('users');

  constructor(private fireStore: AngularFirestore) { }

  async createUser(user: User): Promise<string> {
    try {
      const docRef = await this.userRef.add(user);
      return docRef.id;
    } catch (error) {
      console.log(`UsersService::createUser Error -> ${error}`);
      return error;
    }
  }

  getUser(documentId: string): Observable<Action<DocumentSnapshot<unknown>>> {
    try {
      return this.userRef.doc(documentId).snapshotChanges();
    } catch (error) {
      console.log(`UsersService::getUser Error -> ${error}`);
      return error;
    }
  }

  getAllUsers(): Observable<DocumentChangeAction<unknown>[]> {
    try {
      return this.userRef.snapshotChanges();
    } catch (error) {
      console.log(`UsersService::getAllUsers Error -> ${error}`);
      return error;
    }
  }

  getUsersBySection(section: string): Observable<DocumentChangeAction<unknown>[]> {
    try {
      return this.fireStore.collection('users', ref => ref.where('section', '==', section)).snapshotChanges();
    } catch (error) {
      console.log(`UsersService::getAllUsers Error -> ${error}`);
      return error;
    }
  }

  async updateUser(documentId: string, userUpdated: User) {
    try {
      return await this.userRef.doc(documentId).update(userUpdated);
    } catch (error) {
      console.log(`UsersService::updateUser Error -> ${error}`);
      return error;
    }
  }

  async deleteUser(documentId: string) {
    try {
      return await this.userRef.doc(documentId).delete();
    } catch (error) {
      console.log(`UsersService::deleteUser Error -> ${error}`);
      return error;
    }
  }
}
