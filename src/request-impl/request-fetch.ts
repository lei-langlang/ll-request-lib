import { Requestor } from "../request-core/interface";
import InterceptorManager from "./interceptor";
import { Interceptors, PromiseChain, RequestOptions } from "./type.interface";

/**
 * 创建 fetch 请求器
 */
export class FetchRequest implements Requestor {
	public defaults: RequestOptions;
	private interceptors: Interceptors;

	constructor(options?: RequestOptions) {
		console.log("============ 创建 fetch 请求器 ============");

		this.defaults = options || {};

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
	async defaultRequest(url: string, options: RequestOptions) {
		try {
			const response = await fetch(url, options);
			return response;
		} catch (error) {
			return error;
		}
	}

	/**
	 * 封装请求函数，结合拦截器
	 *
	 * @param method 请求方法
	 * @param url 请求地址
	 * @param options 配置项
	 */
	request(method: string, url: string, options: RequestOptions) {
		// 请求配置项
		const config = {
			method,
			url,
			...this.defaults,
			...options,
		};

		// 拼接完整的url
		const fullUrl = (config.baseURL || "") + config.url;

		// 定义一个数组，这个数组就是要执行的任务链，默认有一个真正发送请求的任务
		const chain: PromiseChain[] = [
			{
				resolved: this.defaultRequest.bind(this, fullUrl, config),
				rejected: undefined,
			},
		];

		// 把用户定义的请求拦截器存放到任务链中，请求拦截器最后注册的最先执行，所以使用unshift方法
		this.interceptors.request.addIntoChain((interceptor: PromiseChain) => {
			chain.unshift(interceptor);
		});
		// 把响应拦截器存放到任务链中
		this.interceptors.response.addIntoChain((interceptor: PromiseChain) => {
			chain.push(interceptor);
		});

		// 利用config初始化一个promise
		let promise = Promise.resolve(config);
		// 遍历任务链
		while (chain.length) {
			// 取出任务链的首个任务
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
	 * @returns Promise<请求结果>
	 */
	get() {
		let url = arguments[0];
		if (!url) {
			throw new Error("url 不能为空");
		}
		if (arguments[1]) {
			let paramsList: string[] = [];
			Object.keys(arguments[1]).forEach((key) => {
				paramsList.push(`${key}=${arguments[1][key]}`);
			});
			url += `?${paramsList.join("&")}`;
		}

		return this.request("get", url, arguments[2]);
	}

	/**
	 * post 请求
	 *
	 * @param url 请求地址
	 * @param data 请求参数
	 * @returns Promise<请求结果>
	 */
	post() {
		const url = arguments[0] || "";
		if (!url) {
			throw new Error("url 不能为空");
		}
		const data = arguments[1] || {};
		const options = arguments[2] || {};

		if (Object.prototype.toString.call(data) == "[object Object]") {
			options.body = JSON.stringify(data);
		} else {
			options.body = data;
		}

		return this.request("post", url, options);
	}

	/**
	 * put 请求
	 *
	 * @param url 请求地址
	 * @param data 请求参数
	 * @returns Promise<请求结果>
	 */
	put() {
		const url = arguments[0] || "";
		if (!url) {
			throw new Error("url 不能为空");
		}
		const data = arguments[1] || {};
		const options = arguments[2] || {};

		if (Object.prototype.toString.call(data) == "[object Object]") {
			options.body = JSON.stringify(data);
		} else {
			options.body = data;
		}

		return this.request("put", url, options);
	}

	/**
	 * delete 请求
	 *
	 * @param url 请求地址
	 * @returns Promise<请求结果>
	 */
	delete() {
		let url = arguments[0];
		if (!url) {
			throw new Error("url 不能为空");
		}

		if (arguments[1]) {
			let paramsList: string[] = [];
			Object.keys(arguments[1]).forEach((key) => {
				paramsList.push(`${key}=${arguments[1][key]}`);
			});
			url += `?${paramsList.join("&")}`;
		}

		return this.request("delete", url, arguments[2]);
	}
}
