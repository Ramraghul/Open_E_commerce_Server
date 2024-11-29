//Generate 6 Digit OTP
export function generateOTP(): number {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp;
}