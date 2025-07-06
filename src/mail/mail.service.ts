import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { MailerService } from '@nestjs-modules/mailer';
import appConfig from '../config/app.config';

@Injectable()
export class MailService {
  constructor(
    @InjectQueue('mail-queue') private queue: Queue,
    private mailerService: MailerService,
  ) {}

  async sendMemberInvitation({ user, member, url }) {
    try {
      const from = `${process.env.APP_NAME} <${appConfig().mail.from}>`;
      const subject = `${user.fname} is inviting you to ${appConfig().app.name}`;

      // add to queue
      await this.queue.add('sendMemberInvitation', {
        to: member.email,
        from: from,
        subject: subject,
        template: 'member-invitation',
        context: {
          user: user,
          member: member,
          url: url,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  // send otp code for email verification
  async sendOtpCodeToEmail({ name, email, otp }) {
    try {
      const from = `${process.env.APP_NAME} <${appConfig().mail.from}>`;
      const subject = 'Email Verification';

      // add to queue
      await this.queue.add('sendOtpCodeToEmail', {
        to: email,
        from: from,
        subject: subject,
        template: 'email-verification',
        context: {
          name: name,
          otp: otp,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async sendVerificationLink(params: {
    email: string;
    name: string;
    token: string;
    type: string;
  }) {
    try {
      const verificationLink = `${appConfig().app.client_app_url}/verify-email?token=${params.token}&email=${params.email}&type=${params.type}`;

      // add to queue
      await this.queue.add('sendVerificationLink', {
        to: params.email,
        subject: 'Verify Your Email',
        template: './verification-link',
        context: {
          name: params.name,
          verificationLink,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async sendInspectionPDF(params: {
    email: string;
    jobId: string;
    jobData: any;
  }) {
    try {
      const from = `${process.env.APP_NAME} <${appConfig().mail.from}>`;
      const subject = `Inspection Report - FHA #${params.jobData.fha_number}`;
      
      // console.log("from", from);
      // add to queue
      await this.queue.add('sendInspectionPDF', {
        to: params.email,
        from: from,
        subject: subject,
        template: 'inspection-report',
        context: {
          jobData: params.jobData,
          jobId: params.jobId,
        },
        attachments: [
          {
            filename: `${params.jobId}.pdf`,
            path: `${process.env.BACKEND_URL}/public/storage/inspection-pdf/${params.jobId}.pdf`,
          },
        ],
      },{
        removeOnComplete:{ age: 10 * 60 * 1000},
        attempts: 2,
        backoff:{
          type: 'exponential',
          delay: 5000,
        },
        removeOnFail:{ age: 10 * 60 * 1000},
      }
    );
    } catch (error) {
      console.log(error);
    }
  }
}
