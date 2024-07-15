import { Injectable } from '@angular/core';
import { IUserLogin } from '../models/user.interface';
import { IUserLoginResponse, IUserLogoutResponse, IUserResendTwoFactor, IUserVerifyTwoFactor } from '../models/user.response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private login_url = "https://localhost:44339/api/User/login";

  private _2factor_url = "https://localhost:44339/api/User/verify-2fa";

  private _2factor_resend_url = "https://localhost:44339/api/User/resend-2fa";

  private logout_url = "https://localhost:44339/api/User/logout";

  private force_logout_url = "https://localhost:44339/api/User/force-logout";


  public async login(userDetails: IUserLogin) {
    const res = await fetch(this.login_url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userDetails)
    });

    const data = await res.json() as IUserLoginResponse;

    console.log(data);
    return data;
  }

  public async sendTwoFactorCode(userDetails: {
    TwoFactorCode: string;
    username: string;
    password: string;
  }) {
    const res = await fetch(this._2factor_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userDetails)
    });

    const data = await res.json() as IUserVerifyTwoFactor;

    return data;
  }

  public async resendTwoFactorCode(userDetails: {
    username: string;
    password: string;
  }) {
    const res = await fetch(this._2factor_resend_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userDetails)
    });

    const data = await res.json() as IUserResendTwoFactor;

    return data;
  }


  public async logout() {
    const token = sessionStorage.getItem('token') ?? "token";

    const res = await fetch(this.logout_url, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${JSON.parse(token)}`,
        "Content-Type": "application/json"
      }
    });


    const data = await res.json() as IUserLogoutResponse;
    return data;
  }

  public async forceLogout(user:IUserLogin) {
    const res = await fetch(this.force_logout_url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    })

    const data = await res.json();

    console.log(data);
  }

}
