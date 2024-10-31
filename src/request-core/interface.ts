import { AxiosRequestor } from "../request-impl/request-axios";
import { FetchRequestor } from "../request-impl/request-fetch";
import { RequestData, AxiosRequestOptions, FetchRequestOptions } from "../request-impl/type.interface";

/**
 * 请求器接口
 */
export interface Requestor<T = AxiosRequestOptions | FetchRequestOptions | AxiosRequestor | FetchRequestor> {
	get(url: string, params?: RequestData, options?: AxiosRequestOptions | FetchRequestOptions): Promise<T>;
	post(url: string, body?: RequestData, options?: AxiosRequestOptions | FetchRequestOptions): Promise<T>;
	put(url: string, body?: RequestData, options?: AxiosRequestOptions | FetchRequestOptions): Promise<T>;
	delete(url: string, params?: RequestData, options?: AxiosRequestOptions | FetchRequestOptions): Promise<T>;
}
