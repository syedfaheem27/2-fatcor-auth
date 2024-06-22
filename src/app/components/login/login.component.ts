import { Component, OnInit } from '@angular/core';
import { IUserLogin } from 'src/app/models/user.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  private api_url = "https://localhost:44339/api/User/login"
  constructor() { }

  ngOnInit(): void { }

  public async handleSubmit(event: Event) {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);

    //add types
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!username || !password)
      return alert("Username and Password is required!");

    // const hashedObj = await hashPassword(password);

    // if (!hashedObj.isSuccess)
    //   alert(hashedObj.errorMessage);

    const user: IUserLogin = {
      username,
      // password: hashedObj.hash as string
      password
    }

    console.log(user);

    try {
      const res = await fetch(this.api_url, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      })

      const data = await res.json();

      console.log(data);

      alert("Successfully logged in!");


    } catch (err) {
      console.log(err, 'error');
    }

  }
}
