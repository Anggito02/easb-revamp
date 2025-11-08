export class ResponseDto<T = any> {
  status: string;
  responseCode: number;
  message: string;
  data?: T;
}