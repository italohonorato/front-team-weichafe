import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private angularFireAuth: AngularFireAuth) { }

  async login(email: string, pass: string) {
    try {
      const authReponse = await this.angularFireAuth.auth.signInWithEmailAndPassword(email, pass);
      console.log(`AngularFireAuth Reponse -> ${authReponse}`);
      localStorage.setItem('userLoggedIn', authReponse.user.email);
      localStorage.setItem('userLogedInUid', authReponse.user.uid);
      return authReponse;
    } catch (error) {
      console.log(`FirebaseService::login Error -> ${error}`);
      throw error;
    }
  }

  async logout() {
    try {
      localStorage.clear();
      return await this.angularFireAuth.auth.signOut();
    } catch (error) {
      console.log(`FirebaseService::logout Error -> ${error}`);
      return error;
    }
  }

  async currentUser() {
    try {
      return this.angularFireAuth.auth.currentUser;
    } catch (error) {
      console.log(`FirebaseService::currentUser Error -> ${error}`);
      return error;
    }
  }

  async createUser(email: string, password: string): Promise<any> {
    try {
      return await this.angularFireAuth.auth.createUserWithEmailAndPassword(email, password);
    } catch (error) {
      console.log(`FirebaseService::createUser Error -> ${error}`);
      return error;
    }
  }
}
