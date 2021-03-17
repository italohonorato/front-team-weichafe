import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  private activate = false;
  constructor(
    private fireBaseService: FirebaseService,
    private router: Router
  ) { }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    try {
      console.log(childRoute);
      this.fireBaseService.currentUser().then(response => {
        if (response !== null && response.uid !== null) {
          this.activate = true;
        } else {
          Swal.fire('Acceso Denegado', 'Ud. No está autorizado para acceder a esta URL', 'warning');
          this.activate = false;
          this.router.navigate(['/login']);
        }

        return this.activate;
      });
    } catch (error) {
      console.log('Error AuthGuard::AuthGuard ->' + error);
      Swal.fire('Acceso Denegado', 'Ruta protegida', 'info');
      return this.activate;
    }
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    try {
      this.fireBaseService.currentUser().then(response => {
        if (response !== null && response.uid !== null) {
          this.activate = true;
        } else {
          Swal.fire('Acceso Denegado', 'Ud. No está autorizado para acceder a esta URL', 'warning');
          this.activate = false;
          this.router.navigate(['/home']);
        }

        return this.activate;
      });
    } catch (error) {
      console.log('Error AuthGuard::AuthGuard ->' + error);
      Swal.fire('Acceso Denegado', 'Ruta protegida', 'info');
      return this.activate;
    }
  }

}
