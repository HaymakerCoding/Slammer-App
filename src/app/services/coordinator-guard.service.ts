import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CoordinatorGuardService implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  /**
   * Check that a user is logged in and has an admin status, if not send to login page
   * @param next next route activated
   * @param state next route state if allowed access
   */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      // get the path to desired location
      const URL = next.pathFromRoot
      .map(v => v.url.map(segment => segment.toString()).join('/'))
      .join('/');
      if (this.authService.getToken()) {
        // has an access token in memory
        this.authService.setLoggedIn(true);
        return true;
      } else if (this.authService.getRefreshToken() === null) {
        // no refresh token, must login
        sessionStorage.setItem('destination', URL);
        this.router.navigate(['login']);
        return false;
      } else {
        // has a refresh token so lets try to get a new access token
        this.authService.getNewToken().subscribe(response => {
          if (response.status === 200) {
            this.authService.setToken(response.token);
            this.authService.setRefreshToken(response.refreshToken);

            this.router.navigate([URL]);
            this.authService.setLoggedIn(true);
            return true;
          } else {
            sessionStorage.setItem('destination', URL);
            this.router.navigate(['login']);
            return false;
          }
        });

      }

  }
}
