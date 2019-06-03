import { AxiosResponse } from 'axios';

export interface HttpResponse<TResponseData = any>
  extends AxiosResponse<TResponseData> {
  ok: boolean;
}
