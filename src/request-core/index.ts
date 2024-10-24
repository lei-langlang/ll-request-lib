import { Requestor } from "./interface";

// 定义请求器
export let req: Requestor;

/**
 * 获取 requestor
 *
 * @returns 请求器
 */
export function useRequestor(requestor: Requestor, options?: any) {
	req = requestor;
	req.defaults = options;
	return req;
}
