import { sendUserWelcomeMailTemplate } from './mail/sendUserWelcomeMailTemplate';
import { sendForgotPasswordTemplate } from './mail/sendForgotPasswordTemplate';
import { sendVerificationTemplate } from './mail/sendVerificationTemplate';
import * as AWS from 'aws-sdk';

import { sendJobApplicationMailTemplate } from './mail/sendJobApplicationMailTemplate';

const SESConfig = {
  apiVersion: '2010-12-01',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
};

export const sendVerificationEmail = async (
  subject: string,
  email: string,
  firstName: string,
  lastName: string,
  verificationCode: string,
): Promise<any> => {
  const params = {
    Source: 'akaigbokwelaurence@gmail.com',
    Destination: {
      ToAddresses: [email],
    },
    ReplyToAddresses: ['akaigbokwelaurence@gmail.com'],
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: await sendVerificationTemplate(
            firstName,
            lastName,
            verificationCode,
          ),
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },
    },
  };

  return new AWS.SES(SESConfig)
    .sendEmail(params)
    .promise()
    .then((res) => {
      console.log(res);
    });
};

export const sendForgotPasswordToken = async (
  subject: string,
  email: string,
  firstName: string,
  lastName: string,
  token: string,
): Promise<any> => {
  const params = {
    Source: 'daniel.ozeh@cloudfift.com',
    Destination: {
      ToAddresses: [email],
    },
    ReplyToAddresses: ['daniel.ozeh@cloudfift.com'],
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: await sendForgotPasswordTemplate(firstName, lastName, token),
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },
    },
  };

  return new AWS.SES(SESConfig)
    .sendEmail(params)
    .promise()
    .then((res) => {
      console.log(res);
    });
};

export const sendUserWelcomeMail = async (
  subject: string,
  email: string,
  firstName: string,
  lastName: string,
  verificationCode: string,
): Promise<any> => {
  const params = {
    Source: 'daniel.ozeh@cloudfift.com',
    Destination: {
      ToAddresses: [email],
    },
    ReplyToAddresses: ['daniel.ozeh@cloudfift.com'],
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: await sendUserWelcomeMailTemplate(
            firstName,
            lastName,
            verificationCode,
          ),
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },
    },
  };

  return new AWS.SES(SESConfig)
    .sendEmail(params)
    .promise()
    .then((res) => {
      console.log(res);
    });
};

export const sendJobApplicationMail = async (
  subject: string,
  email: string,
  name: string,
  jobTitle: string,
): Promise<any> => {
  const params = {
    Source: 'daniel.ozeh@cloudfift.com',
    Destination: {
      ToAddresses: [email],
    },
    ReplyToAddresses: ['daniel.ozeh@cloudfift.com'],
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: await sendJobApplicationMailTemplate(name, jobTitle),
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },
    },
  };

  return new AWS.SES(SESConfig)
    .sendEmail(params)
    .promise()
    .then((res) => {
      console.log(res);
    });
};
