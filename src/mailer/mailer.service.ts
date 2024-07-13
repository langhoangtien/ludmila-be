import { Injectable } from '@nestjs/common';
import fs from 'node:fs/promises';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import { AllConfigType } from '../config/config.type';

@Injectable()
export class MailerService {
  private readonly transporter: nodemailer.Transporter;
  constructor(private readonly configService: ConfigService<AllConfigType>) {
    console.log('ENV', process.env.NODE_ENV);

    // this.transporter = nodemailer.createTransport({
    //   host: configService.get('mail.host', { infer: true }),
    //   port: configService.get('mail.port', { infer: true }),
    //   ignoreTLS: configService.get('mail.ignoreTLS', { infer: true }),
    //   secure: configService.get('mail.secure', { infer: true }),
    //   requireTLS: configService.get('mail.requireTLS', { infer: true }),
    //   auth: {
    //     user: configService.get('mail.user', { infer: true }),
    //     pass: configService.get('mail.password', { infer: true }),
    //   },
    // });
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.MAIL_CLIENT_ID,
        clientSecret: process.env.MAIL_CLIENT_SECRET,
        refreshToken: process.env.MAIL_REFRESH_TOKEN,
      },
    });

    //   this.transporter = nodemailer.createTransport({
    //     host: 'localhost',
    //     port: 1025,
    //     secure: false,
    //     tls: {
    //       // do not fail on invalid certs
    //       rejectUnauthorized: false,
    //     },
    //   });
  }

  async sendMail({
    templatePath,
    context,
    ...mailOptions
  }: nodemailer.SendMailOptions & {
    templatePath: string;
    context: Record<string, unknown>;
  }): Promise<void> {
    console.log('SENDMIAL1', context);
    let html: string | undefined;
    if (templatePath) {
      const template = await fs.readFile(templatePath, 'utf-8');
      html = Handlebars.compile(template, {
        strict: true,
      })(context);
    }

    await this.transporter.sendMail({
      ...mailOptions,
      from: mailOptions.from
        ? mailOptions.from
        : `"${this.configService.get('mail.defaultName', {
            infer: true,
          })}" <${this.configService.get('mail.defaultEmail', {
            infer: true,
          })}>`,
      html: mailOptions.html ? mailOptions.html : html,
    });
    console.log('SENDMIAL');
  }
}
