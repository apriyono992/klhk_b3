import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';

@Injectable()
export class EmailService {
  private oauth2Client: any;
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    const clientId = this.configService.get('EMAIL_CLIENT_ID');
    const clientSecret = this.configService.get('EMAIL_CLIENT_SECRET');
    const redirectUri = this.configService.get('EMAIL_REDIRECT_URI');
    const refreshToken = this.configService.get('EMAIL_REFRESH_TOKEN');

    this.oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri,
    );
    this.oauth2Client.setCredentials({ refresh_token: refreshToken });

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'sib3.klhk@gmail.com',
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        accessToken: this.getAccessToken(), // Automatically refreshes the token
      },
    });
  }

  private async getAccessToken(): Promise<string> {
    const { token } = await this.oauth2Client.getAccessToken();
    return token || '';
  }

  async sendEmail(
    to: string,
    subject: string,
    text: string,
    html?: string,
  ): Promise<void> {
    console.log(this.configService.get('EMAIL_USER'));
    console.log(this.configService.get('EMAIL_PASSWORD'));
    const mailOptions = {
      from: `"SIB3 KLHK" <${this.configService.get('EMAIL_USER')}>`,
      to,
      subject,
      text,
      html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error(`Error sending email: ${error.message}`);
      throw new Error('Email failed to send');
    }
  }
}
