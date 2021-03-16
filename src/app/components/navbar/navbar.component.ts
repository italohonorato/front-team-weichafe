import { ElementRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css',
    '../../../assets/css/demo.css',
    '../../../assets/css/paper-kit.css']
})
export class NavbarComponent implements OnInit {

  private toggleButton: any;
  private sidebarVisible: boolean;

  constructor(private firebaseService: FirebaseService,
    private router: Router,
    private element: ElementRef) { }

  ngOnInit() {
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
  }

  userLoggedIn(): boolean {
    return localStorage.getItem('userLoggedIn') ? true : false;
  }

  onLogout() {
    this.firebaseService.logout().then(
      response => {
        localStorage.clear();
        this.router.navigate(['home']);
      }
      , error => {
        console.log(`Error onLogout -> ${error}`);
      })
      .catch(error => {
        console.log(`Error onLogout -> ${error}`);
      });
  }

  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const html = document.getElementsByTagName('html')[0];
    // console.log(html);
    // console.log(toggleButton, 'toggle');

    setTimeout(function () {
      toggleButton.classList.add('toggled');
    }, 500);
    html.classList.add('nav-open');

    this.sidebarVisible = true;
  };

  sidebarClose() {
    const html = document.getElementsByTagName('html')[0];
    // console.log(html);
    this.toggleButton.classList.remove('toggled');
    this.sidebarVisible = false;
    html.classList.remove('nav-open');
  };

  sidebarToggle() {
    // const toggleButton = this.toggleButton;
    // const body = document.getElementsByTagName('body')[0];
    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
  };
}
