import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DocumentReference } from '@angular/fire/firestore';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { RoleDoc } from 'src/app/models/role/role-doc';
import { UserDoc } from 'src/app/models/user/user-doc';
import { UsersService } from 'src/app/services/firestore/users/users.service';
import { UtilService } from 'src/app/services/util/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

  getAllUsersSubscription: Subscription;
  usersList: User[];
  userDocList: UserDoc[];
  displayedColumns: string[] = ['name', 'lastName', 'run', 'email', 'dob', 'section', 'opciones'];
  dataSource;
  selectedUser: UserDoc;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private userService: UsersService,
    private uitlService: UtilService) { }

  ngOnDestroy(): void {
    console.log('Ejecuntando ngOnDestroy...');
    this.getAllUsersSubscription.unsubscribe();
  }

  ngOnInit() {
    this.getAllUsers();
  }

  getAllUsers() {
    this.getAllUsersSubscription = this.userService.getAllUsers().subscribe(snapshot => {
      this.userDocList = snapshot.map(userData => {
        let userDoc: UserDoc = new UserDoc();
        userDoc.id = userData.payload.doc.id;
        userDoc.data = this.extractUserData(userData.payload.doc.data());
        return userDoc;
      });
      this.dataSource = new MatTableDataSource<UserDoc>(this.userDocList);
      this.dataSource.paginator = this.paginator;
    }, error => {
      console.log(`ListUsersComponent::getAllUsers Error -> ${error}`);
      Swal.fire('Error al consultar Usuarios', error, 'error');
    });
  }

  extractUserData(data: unknown): User {
    const user: User = {
      uid: data['uid'],
      name: data['name'],
      lastName: data['lastName'],
      email: data['email'],
      rut: data['rut'],
      dv: data['dv'],
      dob: data['dob'] ? data['dob'] : undefined,
      section: data['section']
    };

    return user;
  }

  editUser(user: UserDoc) {
    this.selectedUser = user;
    document.getElementById('openModalButton').click();
  }

  removeUser(userRef: UserDoc) {
    Swal.fire({
      title: 'Está Seguro?',
      text: 'Esta acción no podrá ser revertida!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '&nbsp;Si&nbsp;',
      cancelButtonText: '&nbsp;No&nbsp;'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(userRef.id).then(response => {
          this.getAllUsers();
          Swal.fire('Eliminado!', 'El usuario ha sido eliminado.', 'success');
        }).catch(error => {
          console.log(`ListUsersComponent::removeUser Error -> ${error}`);
          Swal.fire('Error al eliminar Usuario', error, 'error');
        });

      }
    });
  }

  resetSelectedUser(value: boolean) {
    if (value) {
      this.selectedUser = undefined;
    }
  }

  formatRut(run: number, dv: string) {
    return this.uitlService.formatRut(run.toString() + dv);
  }

}