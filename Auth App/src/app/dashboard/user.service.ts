import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient,
              private router: Router) {}

  getUserData() {
    const user_data = JSON.parse(localStorage.getItem('userData'));
    return user_data;
  }

  onLogin() {
    const userData = this.getUserData()
    if(userData) {
      return this.http
        .get(
          'https://adm-api.herokuapp.com/user/' + userData.id.toString()
        )
    }
  }

}
