import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Components
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListUsersComponent } from './dashboard/users/list-users/list-users.component';
// Guard
import { AuthGuard } from '../guards/authorization/auth.guard';
import { IngresarAsistenciaComponent } from './dashboard/asistencia/ingresar-asistencia/ingresar-asistencia.component';
import { StudentsComponent } from './dashboard/students/students/students.component';
import { QueryAssistanceComponent } from './dashboard/asistencia/queryAssistance/query-assistance/query-assistance.component';


const routes: Routes = [
  {
    path: 'dashboard', component: DashboardComponent,
    children: [
      { path: 'registerUser', component: ListUsersComponent },
      { path: 'addAssistance', component: IngresarAsistenciaComponent },
      { path: 'queryAssistance', component: QueryAssistanceComponent },
      { path: 'registerStudent', component: StudentsComponent }
    ]
    // path: '',
    // children: [{
    //   path: 'dashboard',
    //   component: DashboardComponent,
    //   children: [
    //     { path: 'registerUser', component: ListUsersComponent },
    //     { path: 'addAssistence', component: IngresarAsistenciaComponent },
    //     { path: 'registerStudent', component: StudentsComponent }
    //   ]
    // }]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
