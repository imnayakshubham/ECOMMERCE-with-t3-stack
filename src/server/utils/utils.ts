import bcrypt from 'bcrypt'
import crypto from 'crypto'

export const encryptPassword = async (password: string) => {
    const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT))
    return hashedPassword;
}

export const comparePassword = async (password: string, hashedPassword: string) => {
    const passwordMatches = await bcrypt.compare(password, hashedPassword)
    if (passwordMatches) {
        return true;
    } else {
        return false;
    }
}

export const generateOtp = (key: string, otpLength = 8) => {
    const hash = crypto.createHash('sha256');
    hash.update(key);
    const hashedValue = hash.digest('hex');
    const codeNumber = parseInt(hashedValue.substring(0, otpLength), 16) % 1000000;
    return String(codeNumber).padStart(otpLength, '0');
}

