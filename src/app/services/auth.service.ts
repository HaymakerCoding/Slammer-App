import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string;
  private loggedIn = new Subject();
  private userNames;
  private admin: boolean;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getUserNames() {
    return this.userNames;
  }

  getUserNamesFromDb() {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.getToken());
    return this.http.get<any>('https://old.clubeg.golf/common/api_REST/v1/clubeg/members/get-member-nickname/index.php', { headers })
    .pipe(map(response => {
      return response;
    }));
  }

  getLoggedIn() {
    return this.loggedIn;
  }
  setLoggedIn(loggedIn: boolean) {
    this.loggedIn.next(loggedIn);
  }

  setToken(token) {
    this.token = token;
  }

  setAdmin(admin: boolean) {
    this.admin = admin;
  }
  isAdmin(): boolean {
    return this.admin;
  }

  /**
   * Return the in memory access token IF there is one, this will be lost on page reloads
   * If no token we need to use a refresh token to get a new access token.
   * If no access token then we send to login
   */
  getToken() {
    return this.token;
  }

  getRefreshToken() {
    const token = sessionStorage.getItem('egRefreshToken');
    return token ? token : null;
  }

  setRefreshToken(token) {
    sessionStorage.setItem('egRefreshToken', token);
  }

  /**
   * Set an authorization header with the user's token to validate requests
   */
  getAuthHeader(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders().set('Authorization', 'Bearer ' + token);
  }

  /**
   * Use the refresh token to get a new access token from server
   */
  getNewToken() {
    const refreshToken = this.getRefreshToken();
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + refreshToken);
    return this.http.get<any>(environment.API_URL + 'auth/get-new-token.php', { headers })
    .pipe(map(response => {
      return response;
    }));
  }

  /**
   * Login request. Send to data to server for authentication.
   * @param form Format data
   */
  login(form) {
    return this.http.post<any>(environment.API_URL + 'auth/login-new.php', {
      password: form.password,
      email: form.email
    })
    .pipe(map(response => {
      return response;
    }));
  }

  logout() {
    this.setToken(null);
    this.setRefreshToken(null);
    this.setLoggedIn(false);
    sessionStorage.clear();
    this.router.navigate(['/']);
  }

  /**
   * For slammer wrap up we need to confirm user is either a sys admin or else the coordinator set for the specific event selected
   * This is just a client side check to try to restrict regular users to proper events, real verification done server side on any
   * auth requests to api.
   */
  isCoordinator(eventId) {
    const headers = this.getAuthHeader();
    const params = new HttpParams().set('eventId', eventId);
    return this.http.get<any>(environment.API_URL + 'auth/check_slammer_coordinator.php',
    { headers, params })
    .pipe(map(response => {
        return response;
    }));
  }



}
