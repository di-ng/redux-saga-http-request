import { AxiosResponse } from 'axios';

export interface HttpResponse<TResponseData>
  extends AxiosResponse<TResponseData> {
  ok: boolean;
}
