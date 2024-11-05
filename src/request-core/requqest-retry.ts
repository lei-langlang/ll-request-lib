
/*
 * @param {function} fn - 方法名
 * @param {number} delay - 延迟的时间
 * @param {number} times - 重发的次数
 */
function retry<T>(fn: () => Promise<T>, delay: number, times: number): any {
	return new Promise<T>((resolve, reject) => {
		function func() {
			Promise.resolve(fn())
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
		func();
	});
}

export default retry;
