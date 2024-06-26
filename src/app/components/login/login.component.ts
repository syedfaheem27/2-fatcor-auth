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

  public is2FaModalOpen = false;

  public isLogging = false;
  public username: string = "";


  constructor(private router: Router) { }

  ngOnInit(): void { }

  public async handleSubmit(event: Event) {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);

    //add types
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!username || !password)
      return alert("Username and Password is required!");


    const user: IUserLogin = {
      username,
      password
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
        this.is2FaModalOpen = true;
        return alert(data.message);
      }

      if (!data.isSucessfullyLoggedIn)
        throw data.message;

      alert("Successfully logged in!");

      //Store the user info in session storage 
      //Redirect to dashboard
      console.log(data);
      sessionStorage.setItem("username", JSON.stringify(data.username!));
      sessionStorage.setItem("Role", JSON.stringify(data.role!));
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

  async handleTwoFactorAuth(event: Event) {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);

    const code = formData.get("2fa-pass") as string;

    const sendObj = {
      TwoFactorCode: code,
      username: this.username,
      password: '123456789'
    }

    try {
      const res = await fetch(this.api_2factor, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendObj)
      });

      const data = await res.json();
      console.log(data);

      if (data.isVerified) {
        this.is2FaModalOpen = false;
        sessionStorage.setItem("username", JSON.stringify(data.username!));
        sessionStorage.setItem("Role", JSON.stringify(data.role!));
        sessionStorage.setItem("token", JSON.stringify(data.token!));



        if (data.role === 'User')
          this.router.navigate(['/user-dashboard']);
        else
          this.router.navigate(['/admin-dashboard']);
      }
    } catch (err) {
      console.log("error", err);

    }
  }

  handleOutsideClick(event: Event) {
    const el = (event.target as Element).closest('.content');

    if (el !== null)
      return;

    this.is2FaModalOpen = false;
  }
}
