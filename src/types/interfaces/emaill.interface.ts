export interface EmailInterface {
  templateName: string;
  subject: string;
  recipients: string[];
  payload: any;
}
