import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {catchError, tap} from 'rxjs/operators';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {User} from './user.model';

export interface AuthResData {
  user_id: number,
  username: string,
  access_token: string,
  refresh_token: string,
  expires_in: number
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient,
              private router: Router) {}

  signUp(username: string, email: string, password: string): Observable<any> {
    return this.http
      .post(
        'https://adm-api.herokuapp.com/register', {
        username: username,
        email: email,
        password: password
      })
      .pipe(
        catchError(this.handleError)
      );
  }

  login(username: string, password: string): Observable<any> {
    return this.http
      .post<AuthResData>(
        'https://adm-api.herokuapp.com/login', {
        username: username,
        password: password
      })
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            resData['username'],
            resData['user_id'],
            resData['access_token'],
            +resData['expires_in']
          );
        })
      );
  }

  autoLogin() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if(!userData) {
      return;
    }

    const loadedUser = new User(
      userData.username,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if(loadedUser.token) {
      this.user.next(loadedUser);
      this.router.navigate(['/dashboard']);
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if(this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer)
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout()
    }, expirationDuration);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if(!error.error) {
      return throwError(errorMessage)
    } else {
      errorMessage = error.error.message;
      return throwError(errorMessage);
    }
  }

  private handleAuthentication(
    username: string,
    userId: number,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const new_user = new User(username, userId, token, expirationDate);
    this.user.next(new_user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(new_user));
  }
}
