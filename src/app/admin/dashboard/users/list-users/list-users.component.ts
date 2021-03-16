import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { Role } from 'src/app/interfaces/role';
import { User } from 'src/app/interfaces/user';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit, OnDestroy {

  getAllUsersSubscription: Subscription;
  usersList: User[];
  displayedColumns: string[] = ['name', 'lastName', 'run', 'email', 'dob', 'role'];
  dataSource;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private firStoreService: FirestoreService) { }

  ngOnDestroy(): void {
    console.log('Ejecuntando ngOnDestroy...');
    this.getAllUsersSubscription.unsubscribe();
  }

  ngOnInit() {
    this.getAllUsers();
  }

  getAllUsers() {
    this.getAllUsersSubscription = this.firStoreService.getAllUsers().subscribe(response => {
      this.usersList = response.map(object => {
        let user: User;

        user = {
          uid: object.uid,
          name: object.name,
          lastName: object.lastName,
          email: object.email,
          rut: object.rut,
          dv: object.dv,
          dob: object.dob ? object.dob.toDate() : undefined,
          run: object.rut + '-' + object.dv
        }

        return user;
      });

      this.dataSource = new MatTableDataSource<User>(this.usersList);
    }, error => {
      console.log(`ListUsersComponent::getAllUsers Error -> ${error}`);
      Swal.fire('Error al consultar Usuarios', error, 'error');
    });
  }

}
