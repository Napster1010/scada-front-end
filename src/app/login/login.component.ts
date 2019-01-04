import { AuthService } from './../services/auth-service/auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginFailed: boolean;
  serverError: boolean;

  constructor(private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
  }

  login(loginForm: NgForm) {
    this.loginFailed = false;
    let username = loginForm.value['username'];
    let password = loginForm.value['password'];

    this.authService.login(username, password).subscribe(
      data => {
        if(data.hasOwnProperty('message'))
          this.loginFailed = true;
        else{
          console.log(data);
          this.loginFailed = false;
          this.serverError = false;
          let user = {
            'userId': data['userId'],
            'userName': data['name'],
            'role': data['role']
          };  
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.router.navigate(['/home']);
          }
      },
      error => {
        console.log(error);
        this.serverError = true;
      }
    );
  }

}
