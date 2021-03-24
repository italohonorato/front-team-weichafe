import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    pass: ['', Validators.required]
  });

  get email() { return this.loginForm.get('email'); }
  get pass() { return this.loginForm.get('pass'); }

  constructor(
    private fb: FormBuilder,
    private fireBaseService: FirebaseService,
    private router: Router) { }

  ngOnInit() {
  }

  onLogin() {

    this.fireBaseService.login(this.loginForm.get('email').value, this.loginForm.get('pass').value).then(response => {
      console.log(`userLoggedIn ${response.user.email}`);
      this.router.navigate(['/dashboard']);
    }).catch(error => {
      console.log(`Error onLogin -> ${error}`);
      Swal.fire({
        title: 'Error Inicio Sesión',
        text: 'Email o Contraseña incorrecto',
        width: 600,
        padding: '3em',
      });
    });
  }
}
