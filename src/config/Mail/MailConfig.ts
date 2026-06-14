import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.APP_MAIL,
        pass: process.env.APP_MAIL_PASSWORD,
    },
});

interface MailData {
    email: string;
    subject: string;
    html: string;
}

export const MailSender = async (Data: MailData) => {
        await transporter.sendMail({
            from: `"${process.env.ME_NAME}" <${process.env.APP_MAIL}>`,
            to: Data.email,
            subject: Data.subject,
            html: Data.html,
        })

    }
