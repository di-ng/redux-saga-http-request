import { AxiosInstance, AxiosRequestConfig } from 'axios';

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

  public async request<TResponseData>() {
    const response = await this.axiosInstance.request<TResponseData>();
    const { status } = response;
    response.ok = status >= 200 && status < 300;
    return response;
  }

  public cancel() {}
}
