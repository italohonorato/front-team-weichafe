import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationComponent } from './components/authentication/authentication/authentication.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './guards/authorization/auth.guard';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: AuthenticationComponent },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(module => module.AdminModule)
  },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
