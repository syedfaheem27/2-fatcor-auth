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

  private error: string = "";

  constructor(private router: Router) { }

  ngOnInit(): void { }

  public async handleSubmit(event: Event) {
    event.preventDefault();

    if (!this.isValidInput())
      return alert(this.error);

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
  private isValidInput(): boolean {
    const phoneRegex = /\d{10}/;
    const emailRegex = /[A-Za-z0-9\._%+\-]+@[A-Za-z0-9\.\-]+\.[A-Za-z]{2,}/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;
    const usernameRegex = /^[0-9A-Za-z]{6,16}$/;

    this.error = "";

    if (!phoneRegex.test(this.phoneNumber))
      this.error += "Invalid Phone number.\n";

    if (!emailRegex.test(this.emailId))
      this.error += "Invalid Email address.\n";

    if (!passwordRegex.test(this.password))
      this.error += "Invalid Password.\nThe password must contain atleast one digit(0-9), one lowercase and uppercase character, one special character and atleast 8 characters and a maximum of 15 characters.\n";

    if (!usernameRegex.test(this.username))
      this.error += "Invalid Username.\nThe username must contain alphanumeric characters only with min. length of 6 and a max. length of 16.";



    return this.password === this.confirmPassword && usernameRegex.test(this.username)
      && phoneRegex.test(this.phoneNumber) && passwordRegex.test(this.password)
      && emailRegex.test(this.emailId);
  }

  handlePassword(data: string) {
    this.password = data;
  }

  handleConfirmPassword(data: string) {
    this.confirmPassword = data;
  }
}
