##  概念
基于 axios 和 fetch 封装的请求库，可以在 axios 和 fetch 之间实现无缝切换

采用依赖倒置原则，将具体实现抽离到 request-impl 层，依赖核心库 request-core 层提供的 Requestor 接口

重新实现一套拦截器，fetch 和 axios 都可使用，使用方式和 axios 拦截器配置一样

重新实现请求超时功能，fetch 和 axios 都可使用，在创建请求器实例时传入相关配置

实现请求重试功能，fetch 和 axios 都可使用，在创建请求器实例时传入相关配置



Requestor 接口内容如下

```js
/**
 * 请求器接口
 */
export interface Requestor<T> {
	get(url: string, params?: RequestData, options?: RequestOptions): Promise<T>;
	post(url: string, body?: RequestData, options?: RequestOptions): Promise<T>;
	put(url: string, body?: RequestData, options?: RequestOptions): Promise<T>;
	delete(url: string, params?: RequestData, options?: RequestOptions): Promise<T>;
}

```

fetch 请求器实现

```js
export class FetchRequestor implements Requestor<Response> {
  ...
}

```

 axios 请求器实现

```js
export class AxiosRequestor implements Requestor<AxiosResponse> {
  ...
}

```

可根据 Requestor 自定义请求器

自定义请求示例

```js
import { Requestor } from 'll-request-lib/src/request-core/interface'

// 自定义请求器
class MyRequestor implement Requestor {
  get() {
      ...
  }
  post() {
      ...
  }
  put() {
      ...
  }
  delete() {
      ...
  }
}
```



##	使用方式

```js
// 1. 引入请求器
import { FetchRequestor, AxiosRequestor } from "ll-request-lib";

// 2. 创建默认配置
const options = {
  baseURL: "http://localhost:3001"
};

// 3. 根据默认配置，选择请求器，创建请求器实例
// const request = new FetchRequestor(options); // 使用 fetch
const request = new AxiosRequestor(options); // 使用 axios

export default request;

```

定义测试接口

```js
import request from "@/utils/request.js";

// 测试 get 请求
export const testGet = (params) => request.get("/test", params);

// 测试 post 请求
export const testPost = (data) => request.post("/test", data);

// 测试 put 请求
export const testPut = (data) => request.put("/test", data);

// 测试 delete 请求
export const testDelete = (params) => request.delete("/test", params);

```



##	拦截器

为了让 fetch 请求也拥有请求拦截器，抛弃了 axios 的拦截器功能，重写了一套适用于 fetch 和 axios 的拦截器

使用方式如下

```js
import { FetchRequestor, AxiosRequestor } from "ll-request-lib";

const options = {
  baseURL: "http://localhost:3001"
};

// const request = new FetchRequestor(options); // 使用 fetch
const request = new AxiosRequestor(options); // 使用 axios

// 设置请求拦截器
request.interceptors.request.use(
  (config) => {
    config.headers = {
      authorization: "Bear xxxxxx",
    };
    return config;
  },
  (error) => {
    console.log("请求拦截器错误");
    return Promise.reject(error);
  }
);

// 设置响应拦截器
request.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("响应拦截器错误", error);
    return Promise.reject(error);
  }
);

export default request;
```



##	请求超时

为 fetch 请求添加请求超时功能，axios 使用自带的超时功能

配置如下

```js
import { FetchRequestor, AxiosRequestor } from "ll-request-lib";

const options = {
	baseURL: "http://127.0.0.1:3001",
    // 设置请求超时时间
	timeout: 20000, // （默认值60000） 
};

// const request = new FetchRequestor(options);
const request = new AxiosRequestor(options);
```



##	请求重试

为 fetch 和 axios 添加共用的请求重试机制，核心代码在 src/*request-core/requqest-retry.ts*

使用方式如下

```js
import { FetchRequestor, AxiosRequestor } from "ll-request-lib";

const options = {
	baseURL: "http://127.0.0.1:3001",
	retry: true, // 是否开启重试（默认值false）
	retryDelay: 1000, // 重试间隔（默认值1000）
	retryTimes: 3, // 重试次数（默认值0）
};

// const request = new FetchRequestor(options);
const request = new AxiosRequestor(options);
```



## 	请求并发控制

为 fetch 和 axios 添加共用的请求并发控制机制，核心代码在 src/*request-core/request-concurrency.ts*

设计如下

```js
/**
 * 请求并发控制
 * @param requestList 请求列表，由 promise 组成
 * @param callback 回调
 * @param limit 限制并发数，默认为5
 */
export function useConcurrency(requestList: Promise<any>[], callback: Function, limit = OPTIONS_CONSTANT.CONCURRENCY_LIMIT) {
  ...
}
```

使用方式如下

```js
import { useConcurrency } from "ll-request-lib";

// 创建并发请求数据（15个请求，皆是 promise）
const requestList = [
  testPost,
  testPut,
  testDelete,
  testPost,
  testPut,
  testDelete,
  testPost,
  testPut,
  testDelete,
  testPost,
  testPut,
  testDelete,
  testPost,
  testPut,
  testDelete,
];

// 并发请求完成后执行的回调
function callback(res) {
   console.log("并发请求结果", res);
}

// 使用并发控制
useConcurrency(requestList, callback, 2);

```

