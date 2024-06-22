export interface IUserRegister {
    role?: string;
    username: string;
    emailId: string | null;
    phone: string | null;
    password: string

}

export interface IUserLogin {
    username: string;
    password: string;
}