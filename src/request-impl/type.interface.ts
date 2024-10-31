import InterceptorManager from "./interceptor";

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

export interface FetchRequestOptions {
	method?: string;
	body?: any;
	baseURL?: string;
	url?: string;
	headers?: any;
}

export interface AxiosRequestOptions {
	method?: string;
	params?: object;
	data?: object;
	baseURL?: string;
	url?: string;
	headers?: any;
}

// 拦截器对象接口类型
export interface Interceptor {
	resolved: ResolvedFn;
	rejected?: RejectedFn;
}

export interface PromiseChain {
	resolved: ResolvedFn | ((config: any) => any);
	rejected?: RejectedFn;
}
