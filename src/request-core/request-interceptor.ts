import { Interceptor, RejectedFn, ResolvedFn } from "./type.interface";

/**
 * 拦截器管理类
 */
export default class InterceptorManager {
	// 拦截器数组
	private interceptors: Array<Interceptor>;

	constructor() {
		this.interceptors = [];
	}

	// 收集拦截器
	use(resolved: ResolvedFn, rejected: RejectedFn): void {
		this.interceptors.push({
			resolved,
			rejected,
		});
	}

	// 遍历用户写的拦截器，并执行回调，把拦截器作为参数传入
	addIntoChain(fn: (interceptor: Interceptor) => void): void {
		this.interceptors.forEach((interceptor: Interceptor) => {
			interceptor && fn(interceptor);
		});
	}
}
