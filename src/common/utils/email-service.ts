import { Service } from "typedi";
import sgMail from "@sendgrid/mail";

@Service()
export class EmailService {
    constructor() {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
    }

    private async sendEmail(to: string, subject: string, html: string): Promise<void> {
        const msg = {
            to,
            from: process.env.EMAIL_FROM as string,
            subject,
            html,
        };

        await sgMail.send(msg);
    }

    public async sendResetPasswordEmail(email: string, resetLink: string): Promise<void> {
        const subject = "Reset Your Password";

        const html = `
            <div style="font-family: Arial, sans-serif;">
                <h2>Password Reset Request</h2>
                <p>You requested to reset your password.</p>
                <p>Click the button below to reset it:</p>
                <a href="${resetLink}" 
                style="display:inline-block;padding:10px 20px;background:#007bff;color:#fff;text-decoration:none;border-radius:5px;">
                Reset Password
                </a>
                <p>This link will expire in 15 minutes.</p>
                <p>If you didn’t request this, please ignore this email.</p>
            </div>
    `;

        await this.sendEmail(email, subject, html);
    }
}