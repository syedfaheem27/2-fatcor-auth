import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUserLogin } from 'src/app/models/user.interface';
import { IUserLoginResponse } from 'src/app/models/user.response';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  private api_url = "https://localhost:44339/api/User/login";

  private api_2factor = "https://localhost:44339/api/User/verify-2fa";

  private api_2factor_retry = "https://localhost:44339/api/User/resend-2fa";

  public is2FaOpen = true;
  public resend2Fa = true;
  public isLogging = false;
  public isSendingCode = false;
  public isResendingCode = false;

  public username: string = "";
  public password: string = "";
  public _2faCode: string = "";

  constructor(private router: Router) { }

  ngOnInit(): void {
    const token = sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');

    if (token !== null) {
      if (role !== null && JSON.parse(role) === 'User') {
        this.router.navigate(['/user-dashboard']);
        console.log("user");
      }
      else {
        this.router.navigate(['/admin-dashboard']);
        console.log("admin");
      }
    }
  }

  public async handleSubmit(event: Event) {
    event.preventDefault();

    if (!this.username || !this.password)
      return alert("Username and Password is required!");


    const user: IUserLogin = {
      username: this.username,
      password: this.password
    }

    try {
      this.isLogging = true;

      const res = await fetch(this.api_url, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      });


      const data = await res.json() as IUserLoginResponse;

      if (data.isLoggedInSomewhere)
        return alert("The user is logged in somewhere else!");

      if (data.requires2FA) {
        this.is2FaOpen = true;
        return alert(data.message);
      }

      if (!data.isSucessfullyLoggedIn)
        throw data.message;

      alert("Successfully logged in!");

      //Store the user info in session storage 
      //Redirect to dashboard
      console.log(data);
      sessionStorage.setItem("username", JSON.stringify(data.username!));
      sessionStorage.setItem("role", JSON.stringify(data.role!));
      sessionStorage.setItem("token", JSON.stringify(data.token!));

      if (data.role === 'User')
        this.router.navigate(['/user-dashboard']);
      else
        this.router.navigate(['/admin-dashboard']);


    } catch (err) {
      console.log(err, 'error');
    } finally {
      this.isLogging = false;
    }

  }

  async handleTwoFactorAuth() {

    try {
      this.isSendingCode = true;
      const sendObj = {
        TwoFactorCode: this._2faCode,
        username: this.username,
        password: this.password
      }
      const res = await fetch(this.api_2factor, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendObj)
      });

      const data = await res.json();
      console.log(data);



      if (!data.isVerified) {
        alert(data.message);
        console.log(data);

        if (data.hasExpired)
          this.resend2Fa = true;

        return;
      }

      //If control reaches here 
      //means the code is verified

      this.is2FaOpen = false;
      sessionStorage.setItem("username", JSON.stringify(data.username!));
      sessionStorage.setItem("role", JSON.stringify(data.role!));
      sessionStorage.setItem("token", JSON.stringify(data.token!));



      if (data.role === 'User')
        this.router.navigate(['/user-dashboard'], { replaceUrl: true });
      else
        this.router.navigate(['/admin-dashboard'], { replaceUrl: true });

    } catch (err) {
      console.log("error", err);

    } finally {
      this.isSendingCode = false;
    }
  }

  public async handleResendTwoFactor() {
    try {
      this.isResendingCode = true;
      const resendObj = {
        username: this.username,
        password: this.password
      }

      const res = await fetch(this.api_2factor_retry, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resendObj)
      });

      const data_1 = await res.json();
      console.log(data_1);

      if (!data_1.resentSuccessfully && !data_1.hasUser) {
        alert(data_1.message);
        this.router.navigate(['/login']);
      }

      if (data_1.resentSuccessfully) {
        alert(data_1.message);
        this.resend2Fa = false;
      }

    } catch (err) {
      console.log(err);

    } finally {
      this.isResendingCode = false;
    }
  }


  handlePassword(pass: string): void {
    this.password = pass;
  }



}
