import { APP_STATE } from '@enum/app';

export interface IApp {
  loadState: APP_STATE;
  canLoad(): boolean;
}
export interface ServerResp {
  statusCode: number;
  message: string;
  data?: object;
}
