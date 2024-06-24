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
  private api_url = "https://localhost:44339/api/User/login"
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

      if (data.requires2FA)
        return alert(data.message);

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
    }

  }
}
