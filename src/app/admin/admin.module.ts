// Components
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminNavbarComponent } from './dashboard/navbar/admin.navbar.component';
import { ListUsersComponent } from './dashboard/users/list-users/list-users.component';
import { RegisterUserComponent } from './dashboard/users/register-user/register-user.component';
// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
// Angular-Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { RegisterModalComponent } from './dashboard/users/list-users/register-modal/register-modal.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ListUsersComponent,
    RegisterUserComponent,
    AdminNavbarComponent,
    RegisterModalComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatMenuModule,
    MatButtonModule,
    MatListModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTooltipModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  exports: [
    DashboardComponent,
    ListUsersComponent,
    RegisterUserComponent,
    AdminNavbarComponent
  ]
})
export class AdminModule { }
