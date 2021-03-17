import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Role } from 'src/app/interfaces/role';
import { User } from 'src/app/interfaces/user';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { UtilService } from 'src/app/services/util/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.css']
})
export class RegisterModalComponent implements OnInit, OnChanges {

  registerForm = this.formBuilder.group({
    name: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    pass: ['', Validators.required],
    rut: ['', Validators.required],
    dob: [''],
    role: [[''], Validators.required]
  });

  public roles: Role[] = new Array<Role>();
  get name() { return this.registerForm.get('name') }
  get lastName() { return this.registerForm.get('lastName') }
  get email() { return this.registerForm.get('email') }
  get pass() { return this.registerForm.get('pass') }
  get rut() { return this.registerForm.get('rut') }
  get dob() { return this.registerForm.get('dob') }
  get role() { return this.registerForm.get('role') }
  @Input() user: User;
  @Output() resetSelectedUserEvent = new EventEmitter<boolean>();

  constructor(private formBuilder: FormBuilder,
    private fireStoreService: FirestoreService,
    private fireBaseService: FirebaseService,
    private utilService: UtilService) {

  }

  resetSelectedUserValue(value: boolean) {
    this.resetSelectedUserEvent.emit(value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (let propName in changes) {
      if (propName === 'user' && changes[propName].currentValue !== undefined) {
        this.loadUserInfo();
      }
    }
  }

  ngOnInit() {
    this.fireStoreService.getAllRoles().subscribe(roles => this.roles.push(...roles));
  }

  loadUserInfo() {
    let dobFormatted = this.user.dob ? this.utilService.formatDate(this.user.dob, 'dd/MM/yyyy') : '';
    console.log(`DOB -> ${dobFormatted}`);

    this.registerForm.patchValue({
      name: this.user.name,
      lastName: this.user.lastName,
      email: this.user.email,
      rut: this.user.rut + this.user.dv,
      dob: dobFormatted,
      role: [''],
    });
  }

  resetTaskForm() {
    this.user = undefined;
    this.resetSelectedUserValue(true);
    this.registerForm.patchValue({
      name: [''],
      lastName: [''],
      email: [''],
      pass: [''],
      rut: [''],
      dob: [''],
      role: [['']],
    });
  }

  formatRut() {
    if (this.registerForm.get('rut').value !== undefined) {
      const rutFormatted = this.utilService.formatRut(this.registerForm.get('rut').value);
      this.registerForm.get('rut').setValue(rutFormatted);
    }
  }

  onCreate() {
    try {
      this.fireBaseService.createUser(this.registerForm.get('email').value, this.registerForm.get('pass').value)
        .then(response => {
          if (response !== undefined && response.user.uid) {
            // Setting User Info
            const userInfo: User = {
              uid: response.user.uid,
              email: this.registerForm.get('email').value,
              name: this.registerForm.get('name').value,
              lastName: this.registerForm.get('lastName').value,
              rut: +this.utilService.removeDotsAndDvRut(this.registerForm.get('rut').value),
              dv: this.utilService.getDvRut(this.registerForm.get('rut').value),
              role: this.registerForm.get('role').value as Role
            };
            // Creates User on FireStore
            this.fireStoreService.createUser(userInfo).then(fssResponse => {
              Swal.fire('Registro de Usuarios', 'Usuario creado con éxito', 'success');
              this.registerForm.reset();
            }).catch(error => {
              console.log(`FireStoreService::createUser Error -> ${error}`);
              Swal.fire('Registro de Usuario', 'Ha ocurrido un error al crea usuario', 'error');
            });
          } else if (response.message) {
            console.log(`FireStoreService::createUser Error -> ${response.message}`);
            if (response.code === 'auth/email-already-in-use') {
              Swal.fire('Registro de Usuario', 'Ya existe una cuenta asociada al correo ingresado', 'error');
            } else {
              Swal.fire('Registro de Usuario', response.message, 'error');
            }
          }
        })
        .catch(error => {
          console.log(`FireBaseService::createUser Error -> ${error}`);
          Swal.fire('Registro de Usuario', error, 'error');
        });

    } catch (error) {
      console.log(`RegisterUserComponent::onCreate Error -> ${error}`);
      Swal.fire('Registro de Usuario', 'Ha ocurrido un error al crea usuario', 'error');
    }
  }

  editUser(userRef: User) {

  }

  removeUser(userRef: User) {

  }
}
