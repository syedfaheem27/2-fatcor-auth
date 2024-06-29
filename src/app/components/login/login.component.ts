import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUserLogin } from 'src/app/models/user.interface';
import { IUserLoginResponse, IUserResendTwoFactor, IUserVerifyTwoFactor } from 'src/app/models/user.response';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public is2FaOpen = false;
  public resend2Fa = false;
  public isLogging = false;
  public isSendingCode = false;
  public isResendingCode = false;

  public username: string = "";
  public password: string = "";
  public _2faCode: string = "";

  constructor(private router: Router, private authService: AuthService) { }

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


    try {
      this.isLogging = true;

      const user: IUserLogin = {
        username: this.username,
        password: this.password
      }
      const data = await this.authService.login(user);

      if (data.isLoggedInSomewhere) {
        const response = confirm("The user is logged in somewhere! \n Do you want to logout the user?");
        if (response) {
          await this.authService.forceLogout({
            username: this.username,
            password: this.password
          });
        }

        return;
      }

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

      this.storeUserDetails(data.username!, data.role!, data.token!);

      if (data.role === 'User')
        this.router.navigate(['/user-dashboard']);
      else
        this.router.navigate(['/admin-dashboard']);


    } catch (err) {
      console.log(err, 'error');
      alert(err);
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
      const data = await this.authService.sendTwoFactorCode(sendObj);

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
      this.storeUserDetails(data.username!, data.role!, data.token!);

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

      const data = await this.authService.resendTwoFactorCode(resendObj);

      console.log(data);

      if (!data.resentSuccessfully && !data.hasUser) {
        alert(data.message);
        this.router.navigate(['/login']);
      }

      if (data.resentSuccessfully) {
        alert(data.message);
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

  private storeUserDetails(username: string, role: string, token: string) {
    sessionStorage.setItem("username", JSON.stringify(username));
    sessionStorage.setItem("role", JSON.stringify(role));
    sessionStorage.setItem("token", JSON.stringify(token));
  }


}
