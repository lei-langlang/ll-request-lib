/**
 * 请求器接口
 */
export interface Requestor {
	defaults?: any;
	get(url: string, params?: any): Promise<any>;
	post(url: string, body?: any): Promise<any>;
}

// 定义请求器
export let req: Requestor;

/**
 * 注册 requestor
 *
 * @param requestor 请求器
 */
export function inject(requestor: Requestor) {
	req = requestor;
}

/**
 * 获取 requestor
 *
 * @returns 请求器
 */
export function useRequestor() {
	return req;
}
