import { stringify } from '@angular/compiler/src/util';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DocumentReference } from '@angular/fire/firestore';
import { Validators, FormBuilder } from '@angular/forms';
import { Role } from 'src/app/interfaces/role';
import { Sections } from 'src/app/interfaces/sections';
import { User } from 'src/app/interfaces/user';
import { RoleDoc } from 'src/app/models/role/role-doc';
import { UserDoc } from 'src/app/models/user/user-doc';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { RolesService } from 'src/app/services/firestore/roles/roles.service';
import { SectionsService } from 'src/app/services/firestore/sections/sections.service';
import { UsersService } from 'src/app/services/firestore/users/users.service';
import { UtilService } from 'src/app/services/util/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.css']
})
export class RegisterModalComponent implements OnInit, OnChanges {

  public roles: RoleDoc[] = new Array<RoleDoc>();
  public sections: Sections[] = new Array<Sections>();
  @Input() user: UserDoc;
  @Output() resetSelectedUserEvent = new EventEmitter<boolean>();
  @ViewChild('closebutton', { static: true }) closebutton;
  // Form
  registerForm = this.formBuilder.group({
    name: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    pass: ['', [Validators.required, Validators.minLength(6)]],
    rut: ['', Validators.required],
    dob: ['', Validators.required],
    role: [[RoleDoc], Validators.required]
  });
  // Getters registerForm
  get name() { return this.registerForm.get('name') }
  get lastName() { return this.registerForm.get('lastName') }
  get email() { return this.registerForm.get('email') }
  get pass() { return this.registerForm.get('pass') }
  get rut() { return this.registerForm.get('rut') }
  get dob() { return this.registerForm.get('dob') }
  get role() { return this.registerForm.get('role') }

  constructor(
    private formBuilder: FormBuilder,
    private fireBaseService: FirebaseService,
    private utilService: UtilService,
    private usersService: UsersService,
    private rolesService: RolesService,
    private sectionsService: SectionsService) {

  }

  resetSelectedUserValue(value: boolean) {
    this.resetSelectedUserEvent.emit(value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (propName === 'user' && changes[propName].currentValue !== undefined) {
        this.loadUserInfo();
      }
    }
  }

  ngOnInit() {
    this.getAllRoles();
    this.getAllSections();
  }

  getAllRoles() {
    this.rolesService.getAllRoles().subscribe(snapshot => {
      this.roles = snapshot.map(data => {
        let rolDoc = new RoleDoc();
        rolDoc.id = data.payload.doc.id;
        rolDoc.data = this.extractRoleData(data.payload.doc.data());
        rolDoc.ref = data.payload.doc.ref;
        return rolDoc;
      });
    });
  }

  getAllSections() {
    this.sectionsService.getAllSections().subscribe(snapshot => {
      this.sections = snapshot.map(data => {
        let unknownObj = data.payload.doc.data();
        let section = {
          name: unknownObj['name']
        }
        return section;
      });
    })
  }

  extractRoleData(data: unknown): Role {
    const role: Role = {
      enabled: data['enabled'],
      roleName: data['roleName']
    };

    return role;
  }

  loadUserInfo() {
    this.registerForm.patchValue({
      name: this.user.data.name,
      lastName: this.user.data.lastName,
      email: this.user.data.email,
      rut: this.utilService.formatRut(this.user.data.rut + this.user.data.dv),
      dob: this.user.data.dob,
      pass: ['xxx'],
      role: this.user.roleDoc.id
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
      role: [['']]
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
      let idRolSelected = this.registerForm.get('role').value;
      let roleSelected = this.roles.find(role => role.id === idRolSelected);
      this.fireBaseService.createUser(this.registerForm.get('email').value, this.registerForm.get('pass').value)
        .then(response => {
          if (response !== undefined && response.user.uid) {
            // Setting User Info
            const userInfo: User = {
              uid: response.user.uid,
              email: this.registerForm.get('email').value,
              name: this.registerForm.get('name').value,
              lastName: this.registerForm.get('lastName').value,
              dob: this.registerForm.get('dob').value,
              rut: +this.utilService.removeDotsAndDvRut(this.registerForm.get('rut').value),
              dv: this.utilService.getDvRut(this.registerForm.get('rut').value),
              role: roleSelected.ref
            };
            // Creates User on FireStore
            this.usersService.createUser(userInfo).then(fssResponse => {
              Swal.fire('Usuario registrado!', 'Usuario ha sido registrado con éxito', 'success');
              this.registerForm.reset();
            }).catch(error => {
              console.log(`FireStoreService::createUser Error -> ${error}`);
              Swal.fire('Error registro de Usuario', 'Ha ocurrido un error al crea usuario', 'error');
            });

            this.closebutton.nativeElement.click();
          } else if (response.message) {
            console.log(`FireStoreService::createUser Error -> ${response.message}`);
            if (response.code === 'auth/email-already-in-use') {
              Swal.fire('Error registro de Usuario', 'Ya existe una cuenta asociada al correo ingresado', 'error');
            } else {
              Swal.fire('Error registro de Usuario', response.message, 'error');
            }
            this.closebutton.nativeElement.click();
          }
        })
        .catch(error => {
          console.log(`FireBaseService::createUser Error -> ${error}`);
          this.closebutton.nativeElement.click();
          Swal.fire('Error registro de Usuario', error, 'error');
        });

    } catch (error) {
      console.log(`RegisterUserComponent::onCreate Error -> ${error}`);
      this.closebutton.nativeElement.click();
      Swal.fire('Error registro de Usuario', 'Ha ocurrido un error al registrar usuario', 'error');
    }
  }

  onUpdate() {
    let idRolSelected = this.registerForm.get('role').value;
    let roleSelected = this.roles.find(role => role.id === idRolSelected);
    const userUpdated: User = {
      uid: this.user.data.uid,
      email: this.registerForm.get('email').value,
      name: this.registerForm.get('name').value,
      lastName: this.registerForm.get('lastName').value,
      dob: this.registerForm.get('dob').value,
      rut: +this.utilService.removeDotsAndDvRut(this.registerForm.get('rut').value),
      dv: this.utilService.getDvRut(this.registerForm.get('rut').value),
      role: roleSelected.ref
    };

    this.usersService.updateUser(this.user.id, userUpdated).then(response => {
      this.closebutton.nativeElement.click();
      Swal.fire('Registro de Usuarios', 'Usuario editado con éxito', 'success');
    }
    ).catch(error => {
      console.log(`RegisterUserComponent::onUpdate Error -> ${error}`);
      this.closebutton.nativeElement.click();
      Swal.fire('Registro de Usuario', 'Ha ocurrido un error al editar usuario', 'error');
    });
  }
}
