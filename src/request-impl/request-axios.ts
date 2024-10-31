import axios from "axios";
import InterceptorManager from "./interceptor";
import { Requestor } from "../request-core/interface";
import { Interceptors, PromiseChain, AxiosRequestOptions, RequestData } from "./type.interface";

/**
 * 创建 axios 请求器
 */
export class AxiosRequestor implements Requestor {
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
	 * 创建 axios 请求
	 *
	 * @param url 请求地址
	 * @param options 配置项
	 */
	private async defaultRequest(options: AxiosRequestOptions): Promise<AxiosRequestOptions | AxiosRequestor> {
		try {
			return await axios(options);
		} catch (error) {
			return Promise.reject(error);
		}
	}

	/**
	 * 封装请求函数，结合拦截器
	 *
	 * @param method 请求方法
	 * @param url 请求地址
	 * @param options 配置项
	 */
	private request(method: string, url: string, options: AxiosRequestOptions): Promise<AxiosRequestOptions | AxiosRequestor> {
		// 请求配置项
		const config: AxiosRequestOptions = {
			method,
			...this.defaults,
			...options,
		};
		// 拼接完整的请求地址
		config.url = (config.baseURL || "") + url;
		// 定义一个数组，这个数组就是要执行的任务链，默认有一个真正发送请求的任务
		const chain: PromiseChain[] = [
			{
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
		let promise: Promise<AxiosRequestOptions | AxiosRequestor> = Promise.resolve(config);
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
			throw new Error("url 不能为空");
		}
		if (params) {
			options.params = params;
		}
		return this.request("get", url, options);
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
			throw new Error("url 不能为空");
		}
		if (data) {
			options.data = data;
		}
		return this.request("post", url, options);
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
			throw new Error("url 不能为空");
		}
		if (data) {
			options.data = data;
		}
		return this.request("put", url, options);
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
			throw new Error("url 不能为空");
		}
		if (params) {
			options.params = params;
		}
		return this.request("delete", url, options);
	}
}
