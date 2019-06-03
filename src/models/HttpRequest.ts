import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { HttpResponse } from '../types/httpResponse';

export class HttpRequest {
  public static create(
    axiosInstance: AxiosInstance,
    config: AxiosRequestConfig,
  ) {
    return new HttpRequest(axiosInstance, config);
  }

  private constructor(
    private axiosInstance: AxiosInstance,
    private config: AxiosRequestConfig,
  ) {}

  public async send<TResponseData>(): Promise<HttpResponse<TResponseData>> {
    const { axiosInstance, config } = this;
    const response = (await axiosInstance.request<TResponseData>(
      config,
    )) as HttpResponse<TResponseData>;
    const { status } = response;
    response.ok = status >= 200 && status < 400;
    return response;
  }

  public cancel() {}
}
