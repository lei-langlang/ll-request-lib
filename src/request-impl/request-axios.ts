import axios, { AxiosResponse } from "axios";
import InterceptorManager from "../request-core/request-interceptor";
import { Requestor } from "../request-core/interface";
import { Interceptors, PromiseChain, AxiosRequestOptions, RequestData, ResolvedFn, REQUEST_METHOD, ERROR_MESSAGE } from "../request-core/type.interface";
import { useRetry } from "../request-core/requqest-retry";

/**
 * 创建 axios 请求器
 */
export class AxiosRequestor implements Requestor<AxiosResponse> {
	// 默认配置
	private defaults: AxiosRequestOptions;
	// 拦截器
	private interceptors: Interceptors;

	constructor(defaults?: AxiosRequestOptions) {
		console.log("============ 创建 axios 请求器 ============");
		this.defaults = defaults || {};
		this.interceptors = {
			request: new InterceptorManager(),
			response: new InterceptorManager(),
		};
	}

	/**
	 * 根据配置是否启用重试功能
	 *
	 * @param url 请求地址
	 * @param options 配置项
	 */
	private async defaultRequest(options: AxiosRequestOptions): Promise<AxiosResponse> {
		try {
			if (options.retry) {
				return await useRetry(this.useAxios.bind(this, options), options.retryDelay, options.retryTimes);
			}
			return this.useAxios(options);
		} catch (error) {
			return Promise.reject(error);
		}
	}

	/**
	 * 创建 axios 请求
	 *
	 * @param url 请求地址
	 * @param options 配置项
	 */
	private async useAxios(options: AxiosRequestOptions): Promise<AxiosResponse> {
		const response = await axios(options);
		try {
			return response.data;
		} catch (error) {
			return response
		}
	}

	/**
	 * 封装请求函数，结合拦截器
	 *
	 * @param method 请求方法
	 * @param url 请求地址
	 * @param options 配置项
	 */
	private async request(method: string, url: string, options: AxiosRequestOptions): Promise<AxiosResponse> {
		// 请求配置项
		const config: AxiosRequestOptions = { method, ...this.defaults, ...options };
		// 拼接完整的请求地址
		config.url = (config.baseURL || "") + url;
		// 定义一个数组，这个数组就是要执行的任务链，默认有一个真正发送请求的任务
		const chain: PromiseChain[] = [
			{
				// resolved: await useRetry(this.defaultRequest.bind(this, config), config.retryDelay, config.retryTimes), // 真正发送的请求,
				resolved: this.defaultRequest.bind(this, config),
				rejected: undefined,
			},
		];
		// 将用户定义的请求拦截器往任务队列前面添加
		this.interceptors.request.addIntoChain((interceptor: PromiseChain) => {
			chain.unshift(interceptor);
		});
		// 将用户定义的响应拦截器往任务队列后面追加
		this.interceptors.response.addIntoChain((interceptor: PromiseChain) => {
			chain.push(interceptor);
		});
		// 利用 config 初始化一个 promise
		let promise: Promise<any> = Promise.resolve(config);
		while (chain.length) {
			// 取出任务队列最前面的任务（内部分别是成功和失败的回调）
			const { resolved, rejected } = chain.shift() as PromiseChain;
			// resolved的执行时机是就是上一个promise执行resolve()的时候，这样就形成了链式调用
			promise = promise.then(resolved, rejected);
		}
		return promise;
	}

	/**
	 * get 请求
	 *
	 * @param url 请求地址
	 * @param params 请求参数
	 * @param options 配置项
	 * @returns Promise<请求结果>
	 */
	get(url: string, params: RequestData, options: AxiosRequestOptions = {}) {
		if (!url) {
			throw new Error(ERROR_MESSAGE.WITHOUT_URL);
		}
		if (params) {
			options.params = params;
		}
		return this.request(REQUEST_METHOD.GET, url, options);
	}

	/**
	 * post 请求
	 *
	 * @param url 请求地址
	 * @param data 请求参数
	 * @param options 配置项
	 * @returns Promise<请求结果>
	 */
	post(url: string, data: RequestData, options: AxiosRequestOptions = {}) {
		if (!url) {
			throw new Error(ERROR_MESSAGE.WITHOUT_URL);
		}
		if (data) {
			options.data = data;
		}
		return this.request(REQUEST_METHOD.POST, url, options);
	}

	/**
	 * put 请求
	 *
	 * @param url 请求地址
	 * @param data 请求参数
	 * @param options 配置项
	 * @returns Promise<请求结果>
	 */
	put(url: string, data: RequestData, options: AxiosRequestOptions = {}) {
		if (!url) {
			throw new Error(ERROR_MESSAGE.WITHOUT_URL);
		}
		if (data) {
			options.data = data;
		}
		return this.request(REQUEST_METHOD.PUT, url, options);
	}

	/**
	 * delete 请求
	 *
	 * @param url 请求地址
	 * @param params 请求参数
	 * @param options 配置项
	 * @returns Promise<请求结果>
	 */
	delete(url: string, params: RequestData, options: AxiosRequestOptions = {}) {
		if (!url) {
			throw new Error(ERROR_MESSAGE.WITHOUT_URL);
		}
		if (params) {
			options.params = params;
		}
		return this.request(REQUEST_METHOD.DELETE, url, options);
	}
}
