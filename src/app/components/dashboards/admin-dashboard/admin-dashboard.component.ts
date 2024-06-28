import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    const token = sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');

    if (token === null || role === null) {
      this.router.navigate(['/login']);
      return;
    }

    if (JSON.parse(role) !== "Admin")
      this.router.navigate(['/login']);


    return;
  }

}
