import { OPTIONS_CONSTANT } from "./type.interface";

/**
 * 请求并发控制
 * @param requestList 请求列表
 * @param callback 回调
 * @param limit 限制并发数
 */
export function useConcurrency(requestList: Promise<any>[], callback: Function, limit = OPTIONS_CONSTANT.CONCURRENCY_LIMIT) {
	// 运行池
	const pool: Set<any> = new Set();
	// 等待队列
	const waitQueue: any[] = [];
	// 完整的请求结果
	const results = new Array(requestList.length).fill(null);
	let count = 0;
	requestList.forEach(async (reqFn: any, idx) => {
		// 包装的新请求
		async function newReqFn() {
			let res: any = null;
			try {
				res = await reqFn();
			} catch (err) {
				res = err;
			} finally {
				count++;
				res.sort = count;
				results[idx] = res;
				// 请求完成后，将该请求从运行池中删除
				pool.delete(newReqFn);
				// 从等待队列中取出一个新请求，如果存在请求，放入运行池中，并执行请求
				const next = waitQueue.shift();
				if (next) {
					pool.add(next);
					next();
				}
				// 全部执行完成，返回完整的执行结果
				if (waitQueue.length == 0 && pool.size == 0) {
					callback && callback(results);
				}
			}
		}
		// 判断运行池是否已满;
		if (pool.size >= limit) {
			// 如果运行池已满，则将新的请求放到等待队列中
			waitQueue.push(newReqFn);
		} else {
			// 如果运行池未满，则向运行池中添加一个新请求并执行该请求
			pool.add(newReqFn);
			await newReqFn();
		}
	});
}
