import { Component, OnInit, OnDestroy, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('loginDialog', { static: true }) loginDialog: TemplateRef<any>;
  form: FormGroup;
  hide: boolean;
  emailError: string;
  passError: string;
  accessError: string;
  subscriptions: Subscription[] = [];
  dialogRef: MatDialogRef<any>;

  constructor(
    public authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.emailError = '';
    this.passError = '';
    this.hide = true;
    this.form = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  ngAfterViewInit() {
    this.dialogRef = this.dialog.open(this.loginDialog, { minWidth: 300, disableClose: true });
  }

  close() {
    this.dialogRef.close();
  }

  /**
   * Submit login data to the server for user verification
   * @param data Form data
   */
  login(data) {
    this.subscriptions.push(this.authService.login(data).subscribe(response => {
      if (response.status === 200) {
        this.authService.setRefreshToken(response.payload[0].refreshToken);
        this.authService.setToken(response.payload[0].token);
        this.authService.setLoggedIn(true);
        this.authService.setAdmin(response.payload[0].admin);
        const destinationURL = sessionStorage.getItem('destination');
        this.router.navigate([destinationURL]);
        this.close();
      } else if (response.status === 401) {
        console.error(response);
        const msg = response.payload;
        this.emailError = '';
        this.passError = '';
        this.form.get('email').setValue('');
        this.form.get('password').setValue('');
        if (msg.includes('User not found')) {
          this.emailError = 'User not found';
        } else if (msg.includes('password')) {
          this.passError = 'Incorrect password';
        }
      } else {
        console.error(response);
      }
    }));
  }

  goToSignUp() {
    const location = window.location.href;
    localStorage.setItem('returnLocation', location);
    window.location.href = 'https://www.clubeg.golf/clubeg-app/#/sign-up';
  }


}
