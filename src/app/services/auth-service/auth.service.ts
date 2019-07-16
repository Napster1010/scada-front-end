import { environment } from 'src/environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {timeout} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,
              private router: Router) { }

  login(username: string, password: string){
    return this.http.get<any>(environment.baseUrl + `/scada/login`, {params: {
      userId: username,
      password: password
    }});
  }

  logout(){
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}
