import nodemailer from 'nodemailer';

/**
 * Sends an email using Nodemailer.
 * @param to - The recipient's email address.
 * @param subject - The subject of the email.
 * @param text - The plain text content of the email.
 * @param html - The HTML content of the email (optional).
 * @returns Promise that resolves if the email is sent successfully, rejects otherwise.
 */
export async function sendEmail(to: string, subject: string, text: string, html?: string): Promise<void> {
    // Create a transporter
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Send email
    await transporter.sendMail({
        from: process.env.EMAIL_USER, 
        to,
        subject,
        text,
        html,
    });
}
