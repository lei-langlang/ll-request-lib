// promise 成功
export interface ResolvedFn<T = any> {
	(val: T): T | Promise<T>;
}

// promise 失败
export interface RejectedFn {
	(error: any): any;
}

// 拦截器对象接口类型
interface Interceptor {
	resolved: ResolvedFn;
	rejected?: RejectedFn;
}

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
