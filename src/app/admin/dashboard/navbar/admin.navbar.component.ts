import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin.navbar.component.html',
  styleUrls: ['./admin.navbar.component.css']
})
export class AdminNavbarComponent implements OnInit {

  constructor(private firebaseService: FirebaseService, private router: Router) { }

  ngOnInit() {
  }

  userLoggedIn(): boolean {
    return localStorage.getItem('userLoggedIn') ? true : false;
  }

  onLogout() {
    this.firebaseService.logout().then(
      response => {
        // localStorage.clear();
        this.router.navigate(['home']);
      }
      , error => {
        console.log(`Error onLogout -> ${error}`);
      })
      .catch(error => {
        console.log(`Error onLogout -> ${error}`);
      });
  }

}
