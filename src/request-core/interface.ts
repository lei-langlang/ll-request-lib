/**
 * 请求器接口
 */
export interface Requestor {
	defaults?: any;
	get(url: string, params?: any): Promise<any>;
	post(url: string, body?: any): Promise<any>;
}