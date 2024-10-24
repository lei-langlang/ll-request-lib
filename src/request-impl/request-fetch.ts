type Interceptor = {
	request: Function[];
	response: Function[];
};

type RequestOptions = {
	body?: string;
	cache?: String;
	credentials?: String;
	headers?: Object;
	method?: String;
	mode?: String;
	redirect?: String;
	referrer?: String;
	baseURL?: String;
};

/**
 * 创建 fetch 请求
 */
export class RequestFetch {
	// 请求配置
	private options: RequestOptions = {};
	defaults: any = {};

	// 拦截器
	interceptor: Interceptor = {
		request: [],
		response: [],
	};

	// 请求拦截器
	private useRequestInterceptor() {
		this.interceptor.request.forEach((interceptor: Function) => {
			interceptor(this.options);
		});
	}

	// 响应拦截器
	private useResponseInterceptor() {
		this.interceptor.response.forEach((interceptor: Function) => {
			interceptor(this.options);
		});
	}

	// 添加拦截器
	addInterceptors(requestInterceptor: Function, responseInterceptor: Function) {
		this.interceptor.request.push(requestInterceptor);
		this.interceptor.response.push(responseInterceptor);
	}

	/**
	 * get 请求
	 *
	 * @param url 请求地址
	 * @returns Promise<请求结果>
	 */
	async get(url: string) {
		const { baseURL } = this.defaults;
		if (baseURL) {
			url = baseURL + url;
		}
		// 合并配置

		// this.useRequestInterceptor();

		console.log("发起请求", url);
		const response = await fetch(url);

		// this.useResponseInterceptor();

		return await response.json();
	}

	/**
	 * post 请求
	 *
	 * @param url 请求地址
	 * @param data 请求参数
	 * @returns Promise<请求结果>
	 */
	async post(url: string, data: any) {
		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		};

		const response = await fetch(url, options);

		return await response.json();
	}
}
