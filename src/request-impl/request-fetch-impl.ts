import { Requestor } from "../request-core/index";
import { RequestFetch } from "./request-fetch";

export const fetchRequestor: Requestor = new RequestFetch();

// /**
//  * 实现 fetch 请求器
//  */
// export const fetchRequestor: Requestor = {
// 	defaults: {},

// 	/**
// 	 * get 请求
// 	 *
// 	 * @param url 请求地址
// 	 * @param options 配置参数
// 	 * @returns get 请求函数
// 	 */
// 	get(url: string, params?: any) {
// 		if (params) {
// 			url +=
// 				"?" +
// 				Object.keys(params)
// 					.map((key) => key + "=" + params[key])
// 					.join("&");
// 		}
// 		return requestFetch.get(url);
// 	},

// 	/**
// 	 * post 请求
// 	 *
// 	 * @param url 请求地址
// 	 * @param options 配置参数
// 	 * @returns post 请求函数
// 	 */
// 	post(url: string, body?: any) {
// 		return requestFetch.post(url, body);
// 	},
// };
