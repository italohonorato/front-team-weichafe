import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private fireStoreService: AngularFirestore) { }

  async createUser(user: User): Promise<string> {
    try {
      const newUser = await this.fireStoreService.collection('users').add(user);
      return newUser.id;
    } catch (error) {
      console.log(`Error FirestoreService::createUser -> ${error}`);
    }
  }

  getUserByUid(uid: string): Observable<any> {
    try {
      return this.fireStoreService.collection('users', ref => ref.where('uid', '==', uid)).valueChanges();
    } catch (error) {
      console.log(`Error FirestoreService::getUser -> ${error}`);
      return error;
    }
  }

  getRoleById(id: string): Observable<any> {
    try {
      return this.fireStoreService.collection('roles', ref => ref.where('id', '==', id)).get();
    } catch (error) {
      console.log(`Error FirestoreService::getUser -> ${error}`);
      return error;
    }
  }

  getAllRoles(): Observable<any[]> {
    try {
      return this.fireStoreService.collection('roles').valueChanges();
    } catch (error) {
      console.log(`Error FirestoreService::getUser -> ${error}`);
      return error;
    }
  }

  getAllUsers(): Observable<any[]> {
    try {
      return this.fireStoreService.collection('users').valueChanges();
    } catch (error) {
      console.log(`Error FirestoreService::getUser -> ${error}`);
      return error;
    }
  }
}
