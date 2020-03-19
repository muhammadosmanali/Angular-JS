import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {User} from './user.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  message: string = null;

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if(!form.valid) {
      return;
    }
    const username = form.value.username;
    const email = form.value.email;
    const password = form.value.password;
    const confirmPassword = form.value.confirmPassword;

    let authObs: Observable<any>

    this.isLoading = true;

    if(this.isLoginMode) {
      authObs = this.authService.login(username, password);
    } else {
      if(password !== confirmPassword) {
        this.error = "Passwords are not matching.";
        return this.error
      } else {
        authObs = this.authService.signUp(username, email, password);
      }
    }

    authObs.subscribe(
      resData => {
        const user_created = "Account"
        setTimeout(() => {
          const msg = resData.message;
          const err = msg.split(" ")
          if (err[0] == user_created) {
            this.message = resData.message;
          } else {
            this.error = resData.message;
          }
        }, 100);
        setTimeout(() => {
          this.error = null;
          this.message = null;
        }, 5000);

        this.isLoading = false;
        if(this.isLoginMode) {
          this.router.navigate(['/dashboard']);
        }
      },
      errorMessage => {
        this.isLoading = false;
        setTimeout(() => {
          this.error = errorMessage;
        }, 100);
        setTimeout(() => {
          this.error = null;
        }, 5000);
      }
    );
    form.reset();
  }

}
