import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  private api_url = "https://localhost:44339/api/User/authenticate"
  constructor(private router: Router) { }

  ngOnInit(): void {
    const token = sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');

    if (token === null || role === null) {
      this.router.navigate(['/login']);
      return;
    }

    if (JSON.parse(role) !== "User")
      this.router.navigate(['/login']);

    return;
  }

  async handleAuthenticate() {
    try {
      const token = sessionStorage.getItem('token');
      console.log(token);
      const res = await fetch(this.api_url, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${JSON.parse(token!)}`,
          "Content-Type": "application/json"
        }
      });


      const data = await res.json();

      if (!data.isAuthenticated)
        return alert(data.message);

      console.log(data);
    } catch (err) {
      console.log(err)
    }
  }

}
