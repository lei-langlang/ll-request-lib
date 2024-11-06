import { RequestData, RequestOptions } from "./type.interface";

/**
 * 请求器接口
 */
export interface Requestor<T> {
	get(url: string, params?: RequestData, options?: RequestOptions): Promise<T>;
	post(url: string, body?: RequestData, options?: RequestOptions): Promise<T>;
	put(url: string, body?: RequestData, options?: RequestOptions): Promise<T>;
	delete(url: string, params?: RequestData, options?: RequestOptions): Promise<T>;
}
