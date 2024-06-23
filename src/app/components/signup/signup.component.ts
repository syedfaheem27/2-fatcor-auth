import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUserRegister } from 'src/app/models/user.interface';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  private api_url = "https://localhost:44339/api/User/register";

  constructor(private router: Router) { }

  ngOnInit(): void { }

  public async handleSubmit(event: Event) {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);

    const username = formData.get('username') as string;
    const emailId = formData.get('email') as string;
    const phoneNumber = formData.get('phone') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!username)
      return alert("Username is missing!");

    if (!emailId && !phoneNumber)
      return alert("EmailId and phone number are missing!");

    if (!password)
      return alert("Password is missing!");

    if (password !== confirmPassword)
      return alert("Password and confirm password are not equal!");



    let user: IUserRegister = {
      username,
      phone: phoneNumber || null,
      password,
      emailId: emailId || null,
      role: "User"
    }

    try {
      const res = await fetch(this.api_url, {
        method: 'POST',
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify(user!)
      });

      const data = await res.json();

      if (data.isRegistered)
        alert("User successfully registered!");
      else
        throw data;

      this.router.navigate(['/login']);

    } catch (err: any) {
      console.log(err, "error");
      alert(err.message);
    }

  }
}
