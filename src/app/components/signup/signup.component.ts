import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUserRegister } from 'src/app/models/user.interface';
import { IUserRegisterResponse } from 'src/app/models/user.response';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  private api_url = "https://localhost:44339/api/User/register";

  public isSigningUp: boolean = false;

  public username: string = '';
  public password: string = '';
  public confirmPassword: string = "";
  public phoneNumber: string = '';
  public emailId: string = "";

  constructor(private router: Router) { }

  ngOnInit(): void { }

  public async handleSubmit(event: Event) {
    event.preventDefault();

    if (!this.username)
      return alert("Username is missing!");

    if (!this.emailId && !this.phoneNumber)
      return alert("EmailId and phone number are missing!");

    if (!this.password)
      return alert("Password is missing!");

    if (this.password !== this.confirmPassword)
      return alert("Password and confirm password are not equal!");



    let user: IUserRegister = {
      username: this.username,
      phone: this.phoneNumber || null,
      password: this.password,
      emailId: this.emailId || null,
      role: "User"
    }

    try {
      this.isSigningUp = true;
      const res = await fetch(this.api_url, {
        method: 'POST',
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify(user!)
      });

      const data = await res.json() as IUserRegisterResponse;

      if (data.isRegistered)
        alert("User successfully registered!");
      else
        throw data;

      this.router.navigate(['/login']);

    } catch (err: any) {
      console.log(err, "error");
      alert(err.message);
    } finally {
      this.isSigningUp = false;
    }

  }

  handlePassword(data: string) {
    this.password = data;
  }

  handleConfirmPassword(data: string) {
    this.confirmPassword = data;
  }
}
