import InterceptorManager from "./interceptor";
import { Requestor } from "../request-core/interface";
import {
	Interceptors,
	PromiseChain,
	FetchRequestOptions,
	RequestData,
	ResolvedFn,
} from "./type.interface";
import retry from "../request-core/requqest-retry";

/**
 * 创建 fetch 请求器
 */
export class FetchRequestor implements Requestor {
	// 默认配置
	private defaults: FetchRequestOptions;
	// 拦截器
	private interceptors: Interceptors;

	constructor(defaults?: FetchRequestOptions) {
		console.log("============ 创建 fetch 请求器 ============");
		this.defaults = defaults || {};
		this.interceptors = {
			request: new InterceptorManager(),
			response: new InterceptorManager(),
		};
	}

	/**
	 * 创建 fetch 请求
	 *
	 * @param url 请求地址
	 * @param options 配置项
	 */
	async defaultRequest(url: string, options: FetchRequestOptions): Promise<any> {
		try {
			// 创建 abort controller，控制请求超时
			const controller = new AbortController();
			options.signal = controller.signal;
			if (options.signal) {
				options.signal.addEventListener("abort", () => {
					controller.abort();
				});
			}
			options.signal = controller.signal;
			let timerId = null;
			try {
				// 生成请求计时器
				timerId = setTimeout(() => {
					controller.abort({
						type: "timeout",
						url: url,
						message: "请求超时",
						statusText: "cancelled",
					});
				}, options.timeout || 60000);

				// 发送请求
				const response = await fetch(url, options);
				try {
					return await response.json();
				} catch (error) {
					return response;
				}
			} catch (error) {
				return Promise.reject(error);
			} finally {
				timerId && clearTimeout(timerId);
			}
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
	request(method: string, url: string, options: FetchRequestOptions): Promise<any> {
		// 请求配置项
		const config: FetchRequestOptions = {
			method,
			url,
			...this.defaults,
			...options,
		};
		config.retryDelay = config.retryDelay || 0;
		config.retryTimes = config.retryTimes || 0;
		// 拼接完整请求地址
		const URL = (config.baseURL || "") + config.url;
		// 定义任务队列，默认有一个真正发送请求的任务
		const chain: PromiseChain[] = [
			{
				resolved: retry<ResolvedFn>(this.defaultRequest.bind(this, URL, config), config.retryDelay, config.retryTimes), // 真正发送的请求
				rejected: undefined, // 占位
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
		let promise: Promise<FetchRequestOptions> = Promise.resolve(config);
		while (chain.length) {
			// 取出任务队列最前面的任务（内部分别是成功和失败的回调）
			const { resolved, rejected } = chain.shift() as PromiseChain;
			// resolved 的执行时机是就是上一个 promise 执行 resolve() 的时候，形成了链式调用
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
	get(url: string, params: RequestData, options: FetchRequestOptions = {}) {
		if (!url) {
			throw new Error("请求地址不能为空");
		}
		// 拼接参数
		if (params) {
			let paramsList: string[] = [];
			Object.keys(params).forEach((key) => {
				paramsList.push(`${key}=${params[key]}`);
			});
			url += `?${paramsList.join("&")}`;
		}
		return this.request("GET", url, options);
	}

	/**
	 * post 请求
	 *
	 * @param url 请求地址
	 * @param data 请求参数
	 * @param options 配置项
	 * @returns Promise<请求结果>
	 */
	post(url: string, data: RequestData = {}, options: FetchRequestOptions = {}) {
		if (!url) {
			throw new Error("请求地址不能为空");
		}
		if (Object.prototype.toString.call(data) == "[object Object]") {
			options.body = JSON.stringify(data);
		} else {
			options.body = data;
		}
		return this.request("POST", url, options);
	}

	/**
	 * put 请求
	 *
	 * @param url 请求地址
	 * @param data 请求参数
	 * @param options 配置项
	 * @returns Promise<请求结果>
	 */
	put(url: string, data: RequestData = {}, options: FetchRequestOptions = {}) {
		if (!url) {
			throw new Error("请求地址不能为空");
		}
		if (Object.prototype.toString.call(data) == "[object Object]") {
			options.body = JSON.stringify(data);
		} else {
			options.body = data;
		}
		return this.request("PUT", url, options);
	}

	/**
	 * delete 请求
	 *
	 * @param url 请求地址
	 * @param params 请求参数
	 * @param options 配置项
	 * @returns Promise<请求结果>
	 */
	delete(url: string, params: RequestData, options: FetchRequestOptions = {}) {
		if (!url) {
			throw new Error("请求地址不能为空");
		}
		if (params) {
			let paramsList: string[] = [];
			Object.keys(params).forEach((key) => {
				paramsList.push(`${key}=${params[key]}`);
			});
			url += `?${paramsList.join("&")}`;
		}
		return this.request("DELETE", url, options);
	}
}
