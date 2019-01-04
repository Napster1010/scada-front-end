import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentLink: string = '1';
  constructor(private router: Router) { 
  }

  ngOnInit() {
  }

  get userName(): string {
    return JSON.parse(localStorage.getItem('currentUser'))['userName'];
  }

  link(changedLink: string) {
    this.currentLink = changedLink;
  }

  logout(){
    this.currentLink = '3';
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}
