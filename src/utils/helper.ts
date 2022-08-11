import axios from 'axios';
import messagebird, { MessageParameters } from 'messagebird';
import DeviceDetector = require('device-detector-js');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const randomstring = require('randomstring');
// eslint-disable-next-line @typescript-eslint/no-var-requires

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const sender = '+12347040324';

import * as AWS from 'aws-sdk';

const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const s3 = new AWS.S3();
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const generateCode = async (characterLength: number): Promise<any> => {
  //return randomInt(characterLength);
  return randomstring.generate(characterLength);
};

export const getRealUserLocation = async (): Promise<any> => {
  const location = await axios.get('http://ip-api.com/json');
  return location;
};

export const getUserDevice = async (): Promise<any> => {
  const deviceDetector = new DeviceDetector();
  const userAgent =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.81 Safari/537.36';
  const device = deviceDetector.parse(userAgent);

  return device;
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const fileUpload = async (file: {
  originalname: any;
  mimetype?: any;
}): Promise<any> => {
  try {
    const { originalname } = file;

    const params = {
      Bucket: AWS_S3_BUCKET_NAME,
      Key: `${Date.now().toString()}-${originalname}`,
      Body: file.originalname,
      ACL: 'public-read',
      ContentType: file.mimetype,
      ContentDisposition: 'inline',
    };

    try {
      const s3Response = await s3.upload(params).promise();
      return {
        status: 'success',
        message: s3Response.Key,
      };
    } catch (e) {
      console.log(e);
      return {
        status: 'failed',
        message: 'Failed',
      };
    }
  } catch (error) {
    return {
      status: 'failed',
      message: error,
    };
  }
};

export const sendSms = async (body: any, recipient: string): Promise<any> => {
  console.log('recipient', recipient);
  const params: MessageParameters = {
    originator: 'dg',
    recipients: [recipient],
    body,
  };

  messagebird(process.env.MSG_BIRD_API_KEY).messages.create(
    params,
    function (err, response) {
      if (err) {
        return console.log(err);
      }
      console.log(response);
    },
  );
};
