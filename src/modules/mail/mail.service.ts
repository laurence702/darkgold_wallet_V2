import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { getPath } from '@utils/helper.functions';
import { EmailInterface } from '@interface/emaill.interface';
import { join } from 'path';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public sendMail(mailConfig: EmailInterface): void {
    this.mailerService
      .sendMail({
        to: mailConfig.recipients,
        from: process.env.EMAIL_FROM,
        subject: mailConfig.subject,
        template: `${getPath()}/${mailConfig.templateName}`,
        context: { ...mailConfig.payload },
      })
      .then((res) => {
        console.log({ res });
      })
      .catch((error) => {
        console.log({ error });
      });
  }
}
