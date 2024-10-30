import InterceptorManager from "./interceptor";

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
	body?: string;
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
