import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivateChild, CanLoad, Route, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  private activate = false;

  constructor(
    private fireBaseService: FirebaseService,
    private router: Router
  ) { }

  canLoad(route: Route, segments: UrlSegment[]): boolean | Promise<boolean> | Observable<boolean> {
    try {
      this.fireBaseService.currentUser().then(response => {
        if (response !== null && response.uid !== null) {
          this.activate = true;
        } else {
          Swal.fire('Acceso Denegado', 'Ud. No está autorizado para acceder a esta URL', 'warning');
          this.activate = false;
          this.router.navigate(['/login']);
        }
        console.log('canLoad -> ' + this.activate);
        return this.activate;
      });
    } catch (error) {
      console.log('Error AuthGuard::canLoad ->' + error);
      Swal.fire('Acceso Denegado', 'Ruta protegida', 'info');
      return this.activate;
    }
  }

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
        console.log('CanActivateChild -> ' + this.activate);
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
        console.log('CanActivate -> ' + this.activate);
        return this.activate;
      });
    } catch (error) {
      console.log('Error AuthGuard::AuthGuard ->' + error);
      Swal.fire('Acceso Denegado', 'Ruta protegida', 'info');
      return this.activate;
    }
  }

}
