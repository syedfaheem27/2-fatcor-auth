import * as bcrypt from 'bcryptjs';

const promisify = (fn: Function) => {
    return (...args: any[]) => {
        return new Promise((res, rej) => {
            fn(...args, (err: any, hash: string) => {
                if (err)
                    return rej("There was a problem while generating the hash!");
                return res(hash);

            })
        })
    }
}

const asyncBcrypt = promisify(bcrypt.hash);

export const hashPassword = async (pwd: string) => {
    try {
        const hash = await asyncBcrypt(pwd, 10);
        return { hash, isSuccess: true };
    } catch (err) {
        return { isSuccess: false, errorMessage: err }
    }
}