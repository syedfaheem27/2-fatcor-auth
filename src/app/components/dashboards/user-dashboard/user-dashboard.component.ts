import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  private api_url = "https://localhost:44339/api/User/authenticate";

  constructor(private router: Router, private authService: AuthService) { }

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

      const res = await fetch(this.api_url, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${JSON.parse(token!)}`,
          "Content-Type": "application/json"
        }
      });

      if (res.status === 401) {
        const isTokenExpired = res.headers.get("Token-Expired");
        const authFailed = res.headers.get("Authentication-Failed");

        if (isTokenExpired) {
          throw new Error("Token authenticaton failed. \nToken Expired!!!");
        }

        if (authFailed)
          throw new Error("Token authentication failed. \nInvalid Token!!!");
      }

      const data = await res.json();

      if (!data.isAuthenticated) {
        return alert(data.message);
        // this.clearUserDetails();
        // window.location.reload();
      }
      console.log(data);
      alert("Authenticated user");

    } catch (err) {
      alert((err as Error).message);

      this.clearUserDetails();
      this.router.navigate(['/login']);
    }
  }

  private clearUserDetails(): void {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");

  }

  async logout() {
    try {
      const { message, clearSession } = await this.authService.logout();

      alert(message);

      if (clearSession) {
        this.clearUserDetails();
        window.location.reload();
      }

    } catch (err) {
      console.log(err);
      alert(err);
    }
  }

}
