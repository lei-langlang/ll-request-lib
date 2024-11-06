import { OPTIONS_CONSTANT } from "./type.interface";

/*
 * @param {function} fn - 方法名
 * @param {number} delay - 延迟的时间
 * @param {number} times - 重发的次数
 */
export async function useRetry<T>(
	fn: () => Promise<T>,
	delay = OPTIONS_CONSTANT.RETRY_DELAY,
	times = OPTIONS_CONSTANT.RETRY_TIMES
): Promise<any> {
	return new Promise<T>(async (resolve, reject) => {
		async function func() {
			fn()
				.then((res) => {
					resolve(res);
				})
				.catch((err) => {
					// 接口失败后，判断剩余次数不为0时，继续重发
					if (times !== 0) {
						setTimeout(func, delay);
						times--;
					} else {
						reject(err);
					}
				});
		}

		await func();
	});
}
