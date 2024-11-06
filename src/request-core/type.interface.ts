import InterceptorManager from "./request-interceptor";

// 任意类型对象
export interface RequestData {
	[key: string]: any;
}

// promise 成功
export interface ResolvedFn<T = any> {
	(val: T): T | Promise<T>;
}

// promise 失败
export interface RejectedFn {
	(error: any): any;
}

export interface Interceptors {
	request: InterceptorManager;
	response: InterceptorManager;
}

export interface RequestOptions {
	method?: string;
	params?: object;
	data?: object;
	baseURL?: string;
	url?: string;
	headers?: any;
	timeout?: number;
	retry?: boolean;
	retryDelay?: number;
	retryTimes?: number;
}

export interface FetchRequestOptions extends RequestOptions {
	body?: any;
	signal?: AbortSignal;
}

export interface AxiosRequestOptions extends RequestOptions {}

// 拦截器对象接口类型
export interface Interceptor {
	resolved: ResolvedFn;
	rejected?: RejectedFn;
}

export interface PromiseChain {
	resolved: ResolvedFn | ((config: any) => any);
	rejected?: RejectedFn;
}

export enum REQUEST_METHOD {
	GET = "GET",
	POST = "POST",
	PUT = "PUT",
	DELETE = "DELETE",
}

export enum OPTIONS_CONSTANT {
	TIMEOUT = 600000,
	RETRY_DELAY = 1000,
	RETRY_TIMES = 0,
	CONCURRENCY_LIMIT = 5,
}

export enum ERROR_MESSAGE {
	WITHOUT_URL = "URL不能为空",
	NETWORK_TIMEOUT = "网络超时",
}
