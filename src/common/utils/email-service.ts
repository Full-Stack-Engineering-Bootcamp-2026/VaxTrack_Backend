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
}