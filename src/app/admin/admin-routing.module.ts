import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Components
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListUsersComponent } from './dashboard/users/list-users/list-users.component';
import { RegisterUserComponent } from './dashboard/users/register-user/register-user.component';
// Guard
import { AuthGuard } from '../guards/authorization/auth.guard';


const routes: Routes = [
  {
    path: 'dashboard', component: DashboardComponent, canActivateChild: [AuthGuard],
    children: [
      { path: 'registerUser', component: RegisterUserComponent },
      { path: 'listUsers', component: ListUsersComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
