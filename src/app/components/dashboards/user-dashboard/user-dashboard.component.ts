import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  private api_url = "https://localhost:44339/api/User/authenticate"
  constructor() { }

  ngOnInit(): void {
  }

  async handleAuthenticate() {
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(this.api_url, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${JSON.parse(token!)}`,
          "Content-Type": "application/json"
        }
      })

      const data = await res.json();

      if (!data.isAuthenticated)
        return alert("Not autenticated");

      console.log(data);
    } catch (err) {
      console.log(err)
    }
  }

}
