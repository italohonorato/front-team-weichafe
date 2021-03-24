import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
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
  selector: 'app-register-student',
  templateUrl: './register-student.component.html',
  styleUrls: ['./register-student.component.css']
})
export class RegisterStudentComponent implements OnInit, OnDestroy, OnChanges {

  subscriptionArr = new Array<Subscription>();
  public roles: RoleDoc[] = new Array<RoleDoc>();
  public sections: Sections[] = new Array<Sections>();
  @Input() user: UserDoc;
  @Output() resetSelectedUserEvent = new EventEmitter<boolean>();
  @ViewChild('closebutton', { static: true }) closebutton;
  // Form
  studentForm = this.formBuilder.group({
    name: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    rut: ['', Validators.required],
    dob: ['', Validators.required],
    section: [[], Validators.required]
  });
  // Getters registerForm
  get name() { return this.studentForm.get('name'); }
  get lastName() { return this.studentForm.get('lastName'); }
  get email() { return this.studentForm.get('email'); }
  get rut() { return this.studentForm.get('rut'); }
  get dob() { return this.studentForm.get('dob'); }
  get section() { return this.studentForm.get('section'); }

  constructor(
    private formBuilder: FormBuilder,
    private fireBaseService: FirebaseService,
    private utilService: UtilService,
    private usersService: UsersService,
    private rolesService: RolesService,
    private sectionsService: SectionsService
  ) { }

  ngOnDestroy(): void {
    console.log('Ejecuntando RegisterStudentComponent::ngOnDestroy...');
    this.subscriptionArr.forEach(subscription => subscription.unsubscribe());
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
    this.getStudentrole();
    this.getAllSections();
  }

  getStudentrole() {
    const subscription = this.rolesService.getRoleByName('ALUMNO').subscribe(snapshot => {
      this.roles = snapshot.map(data => {
        let rolDoc = new RoleDoc();
        rolDoc.id = data.payload.doc.id;
        rolDoc.data = this.extractRoleData(data.payload.doc.data());
        rolDoc.ref = data.payload.doc.ref;
        return rolDoc;
      });
    });

    this.subscriptionArr.push(subscription);
  }

  getAllSections() {
    const subscription = this.sectionsService.getAllSections().subscribe(snapshot => {
      this.sections = snapshot.map(data => {
        const unknownObj = data.payload.doc.data();
        const section = {
          name: unknownObj['name']
        };
        return section;
      });
    });

    this.subscriptionArr.push(subscription);
  }

  extractRoleData(data: unknown): Role {
    const role: Role = {
      enabled: data['enabled'],
      roleName: data['roleName']
    };

    return role;
  }

  loadUserInfo() {
    this.studentForm.patchValue({
      name: this.user.data.name,
      lastName: this.user.data.lastName,
      email: this.user.data.email,
      rut: this.utilService.formatRut(this.user.data.rut + this.user.data.dv),
      dob: this.user.data.dob,
      pass: ['xxx'],
      section: this.user.data.section
    });
  }

  resetTaskForm() {
    this.user = undefined;
    this.resetSelectedUserValue(true);
    this.studentForm.patchValue({
      name: [''],
      lastName: [''],
      email: [''],
      pass: [''],
      rut: [''],
      dob: [''],
      role: [['']],
      section: [['']],
    });
  }

  formatRut() {
    if (this.studentForm.get('rut').value !== undefined) {
      const rutFormatted = this.utilService.formatRut(this.studentForm.get('rut').value);
      this.studentForm.get('rut').setValue(rutFormatted);
    }
  }

  onCreate() {
    try {
      const roleSelected = this.roles[0];
      // Setting User Info
      const userInfo: User = {
        email: this.studentForm.get('email').value,
        name: this.studentForm.get('name').value,
        lastName: this.studentForm.get('lastName').value,
        dob: this.studentForm.get('dob').value,
        rut: this.studentForm.get('rut').value ? +this.utilService.removeDotsAndDvRut(this.studentForm.get('rut').value) : 0,
        dv: this.studentForm.get('rut').value ? this.utilService.getDvRut(this.studentForm.get('rut').value) : '',
        role: roleSelected.ref,
        section: this.studentForm.get('section').value
      };
      // Creates User on FireStore
      this.usersService.createUser(userInfo).then(fssResponse => {
        Swal.fire('Usuario registrado!', 'Usuario ha sido registrado con éxito', 'success');
        this.studentForm.reset();
      }).catch(error => {
        console.log(`FireStoreService::createUser Error -> ${error}`);
        Swal.fire('Error registro de Usuario', 'Ha ocurrido un error al crea usuario', 'error');
      });

      this.closebutton.nativeElement.click();

    } catch (error) {
      console.log(`RegisterUserComponent::onCreate Error -> ${error}`);
      this.closebutton.nativeElement.click();
      Swal.fire('Error registro de Usuario', 'Ha ocurrido un error al registrar usuario', 'error');
    }
  }

  onUpdate() {
    const roleSelected = this.roles[0];
    const userUpdated: User = {
      email: this.studentForm.get('email').value,
      name: this.studentForm.get('name').value,
      lastName: this.studentForm.get('lastName').value,
      dob: this.studentForm.get('dob').value,
      rut: this.studentForm.get('rut').value ? +this.utilService.removeDotsAndDvRut(this.studentForm.get('rut').value) : 0,
      dv: this.studentForm.get('rut').value ? this.utilService.getDvRut(this.studentForm.get('rut').value) : '',
      role: roleSelected.ref,
      section: this.studentForm.get('section').value
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
