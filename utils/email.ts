import nodemailer from 'nodemailer';
import pug from 'pug';
import { htmlToText } from 'html-to-text';
import {IUserModel} from "../models/usersModel";


export default class Email {
    private to: string
    private username: string;
    private from: string;
    private firstName: string;
    private url: string;
    constructor(user: IUserModel, url: string) {
        this.to = user.email;
        this.username = user.name.split(' ')[3];
        this.from = `Project Management System<${process.env.EMAIL_FROM}>`;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
    }


    // newTransport() {
    //     // If in production, create sendgrid transporter
    //     if (process.env.NODE_ENV === 'production') {
    //         // return sendGrid transporter
    //         return nodemailer.createTransport(
    //             {
    //                 host: 'in-v3.mailjet.com',
    //                 port: 25,
    //                 auth: {
    //                     user: process.env.MAILJET_USERNAME,
    //                     password: process.env.MAILJET_SECRET_KEY
    //                 }
    //             }
    //         )
    //     }
    //     return nodemailer.createTransport({
    //         host: process.env.EMAIL_HOST,
    //         port: process.env.EMAIL_PORT,
    //         auth: {
    //             user: process.env.EMAIL_USERNAME,
    //             pass: process.env.EMAIL_PASSWORD
    //         }
    //     });
    // }
    newTransport(){
        return nodemailer.createTransport({
            // host: process.env.EMAIL_HOST,
            // port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }


    async send(template: string, subject: string) {
        // render template
        const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`,
            {
                firstName: this.firstName,
                url: this.url,
                subject,
                username: this.username,
                resourceUrl: this.url,
                loginUrl: this.url
            }
        );


        // mail options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText(html)
        }

        // Create a transport and send an email
        await this.newTransport().sendMail(mailOptions)
    }

    async sendWelcome() {
        await this.send("welcome", "Welcome to Lycee De Kigali Management System");
    }

    async sendPasswordReset(template: string, subject: string): Promise<void> {
        await this.send(template, subject);
    }
}

