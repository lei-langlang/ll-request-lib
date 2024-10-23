




/**
 * 创建 fetch 请求
 */
export class RequestFetch {
	private options: any;

	/**
	 * get 请求
	 *
	 * @param url 请求地址
	 * @returns Promise<请求结果>
	 */
	async get(url: string) {
		const options = {};

		const response = await fetch(url, options);
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

// 请求拦截器
export function useRequestInterceptor() {}

// 响应拦截器
export function useResponseInterceptor() {}
