import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {UserService} from './user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  username: string;

  constructor(private authService: AuthService,
              private userService: UserService) { }

  ngOnInit() {
    const response = this.userService.onLogin().subscribe(
      resData => {
        this.username = resData['username'];
      }
    )
  }

  onLogout() {
    this.authService.logout();
  }

}
