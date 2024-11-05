##  描述
基于 axios 和 fetch 封装的请求库，可以在 axios 和 fetch 之间实现无缝切换

采用依赖倒置原则，具体的实现抽离到 request-impl 中，依赖 request-core 层提供的 Requestor 接口，开放 Requestor 接口给用户，用户可自定义请求器，

重新实现一套拦截器，fetch 和 axios 都可使用，使用方式和 axios 拦截器配置一样

重新实现请求超时功能，fetch 和 axios 都可使用，在创建请求器实例时传入相关配置

实现请求重试功能，fetch 和 axios 都可使用，在创建请求器实例时传入相关配置



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
  }
);

// 设置响应拦截器
request.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("响应拦截器错误", error);
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
	timeout: 20000, 
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
    // 重试间隔时间
    retryDelay: 1000, 
    // 重试次数
	retryTimes: 3, 
};

// const request = new FetchRequestor(options);
const request = new AxiosRequestor(options);
```



##	自定义请求器

开放请求器接口 Requestor，可根据 Requestor 自定义请求器

Requestor 接口内容如下

```js
/**
 * 请求器接口
 */
export interface Requestor<T = AxiosRequestOptions | FetchRequestOptions | AxiosRequestor | FetchRequestor> {
	get(url: string, params?: RequestData, options?: AxiosRequestOptions | FetchRequestOptions): Promise<T>;
	post(url: string, body?: RequestData, options?: AxiosRequestOptions | FetchRequestOptions): Promise<T>;
	put(url: string, body?: RequestData, options?: AxiosRequestOptions | FetchRequestOptions): Promise<T>;
	delete(url: string, params?: RequestData, options?: AxiosRequestOptions | FetchRequestOptions): Promise<T>;
}

```

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

