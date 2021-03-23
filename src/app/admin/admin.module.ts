// Components
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminNavbarComponent } from './dashboard/navbar/admin.navbar.component';
import { ListUsersComponent } from './dashboard/users/list-users/list-users.component';
import { IngresarAsistenciaComponent } from './dashboard/asistencia/ingresar-asistencia/ingresar-asistencia.component';
import { RegisterModalComponent } from './dashboard/users/list-users/register-modal/register-modal.component';
import { StudentsComponent } from './dashboard/students/students/students.component';
import { RegisterStudentComponent } from './dashboard/students/students/register-student/register-student/register-student.component';
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
import { MatCheckboxModule } from '@angular/material/checkbox';
// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { AuthGuard } from '../guards/authorization/auth.guard';
import { QueryAssistanceComponent } from './dashboard/asistencia/queryAssistance/query-assistance/query-assistance.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ListUsersComponent,
    AdminNavbarComponent,
    RegisterModalComponent,
    IngresarAsistenciaComponent,
    StudentsComponent,
    RegisterStudentComponent,
    QueryAssistanceComponent
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
    MatCheckboxModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  exports: [
    DashboardComponent,
    ListUsersComponent,
    AdminNavbarComponent
  ]
})
export class AdminModule { }
