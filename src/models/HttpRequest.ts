import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  Cancel,
  Canceler,
  CancelToken,
} from 'axios';
import { HttpResponse } from '../types/httpResponse';

export const CANCELED_STATUS_TEXT = 'CANCELED';
export const NETWORK_ERROR_STATUS_TEXT = 'NETWORK ERROR';

export class HttpRequest {
  public static create(
    axiosInstance: AxiosInstance,
    config: AxiosRequestConfig,
  ): HttpRequest {
    return new HttpRequest(axiosInstance, config);
  }

  private cancelTokenExecutor: Canceler | undefined;

  constructor(
    private configuredAxiosInstance: AxiosInstance,
    private config: AxiosRequestConfig,
  ) {}

  private createCancelToken(): CancelToken {
    return new axios.CancelToken((cancelExecutor: Canceler) => {
      this.cancelTokenExecutor = cancelExecutor;
    });
  }

  public cancel(reason?: string): void {
    if (this.cancelTokenExecutor) {
      this.cancelTokenExecutor(reason);
      this.cancelTokenExecutor = undefined;
    }
  }

  public async send<TResponseData = any>(): Promise<
    HttpResponse<TResponseData | Cancel | AxiosError>
  > {
    const cancelToken = this.createCancelToken();
    let response: HttpResponse<TResponseData | Cancel | AxiosError>;

    try {
      const axiosResponse = await this.configuredAxiosInstance.request<
        TResponseData
      >({
        ...this.config,
        cancelToken,
      });
      const { status } = axiosResponse;
      response = {
        ...axiosResponse,
        ok: status >= 200 && status < 300,
      };
    } catch (errorOrCancellation) {
      // Because of the way axios is configured to send *ALL* responses through
      // the "success" handler, the errors caught here are caused only by
      //    1. Cancelation
      //    2. Network Error
      //    3. Unknown code error
      const baseErrorResponse = {
        config: this.config,
        data: errorOrCancellation,
        ok: false,
        status: -1,
      };
      if (axios.isCancel(errorOrCancellation)) {
        response = {
          ...baseErrorResponse,
          statusText: CANCELED_STATUS_TEXT,
        } as HttpResponse<Cancel>;
      } else if (errorOrCancellation.request) {
        response = {
          ...baseErrorResponse,
          statusText: NETWORK_ERROR_STATUS_TEXT,
        } as HttpResponse<AxiosError>;
      } else {
        throw errorOrCancellation as AxiosError;
      }
    }

    return response as HttpResponse<TResponseData>;
  }
}
