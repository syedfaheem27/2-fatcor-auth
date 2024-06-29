type Role = "User" | "Admin";

interface CommonResponse {
    message: string;
    username?: string;
    token?: string;
    role?: Role;
}

export interface IUserRegisterResponse {
    isRegistered?: boolean;
    message: string;
}

export interface IUserLoginResponse extends CommonResponse {
    isSucessfullyLoggedIn?: boolean;
    isLoggedInSomewhere?: boolean;
    requires2FA?: boolean;
}

export interface IUserVerifyTwoFactor extends CommonResponse {
    isVerified?: boolean;
    hasExpired?: boolean;

}

export interface IUserResendTwoFactor {
    resentSuccessfully: boolean;
    hasUser: boolean;
    message: string;
}

export interface IUserLogoutResponse {
    message: string;
    clearSession?: boolean;

}