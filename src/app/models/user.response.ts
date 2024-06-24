type Role = "User" | "Admin"

export interface IUserRegisterResponse {
    isRegistered?: boolean;
    message: string;

}

export interface IUserLoginResponse {
    isSucessfullyLoggedIn?: boolean;
    isLoggedInSomewhere?: boolean;
    message: string;
    username?: string;
    token?: string;
    role?: Role;
    requires2FA?: boolean;

}