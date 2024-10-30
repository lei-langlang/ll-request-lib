import { Interceptor, RejectedFn, ResolvedFn } from "./type.interface";

/**
 * 拦截器管理类
 */
export default class InterceptorManager {
	// 拦截器数组
	private interceptors: Array<Interceptor | null>;

	constructor() {
		this.interceptors = [];
	}

	// 收集拦截器
	use(resolved: ResolvedFn, rejected?: RejectedFn): number {
		this.interceptors.push({
			resolved,
			rejected,
		});
		return this.interceptors.length - 1;
	}

	// 遍历用户写的拦截器，并执行fn函数把拦截器作为参数传入
	addIntoChain(fn: (interceptor: Interceptor) => void): void {
		this.interceptors.forEach((interceptor) => {
			if (interceptor !== null) {
				fn(interceptor);
			}
		});
	}
}
