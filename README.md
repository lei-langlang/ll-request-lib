##  描述
基于 axios 和 fetch 封装的请求库，可以在 axios 和 fetch 之间实现无缝切换

采用依赖倒置原则，具体的实现抽离到 request-impl 中，依赖 request-core 层提供的 Requestor 接口

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

// 4. 设置请求拦截器
request.interceptors.request.use(
  (config) => {
    config.headers = {
      authorization: "Bear token",
    };
    return config;
  },
  (error) => {
    console.log("请求拦截器错误");
  }
);

// 5.设置响应拦截器
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

定义接口

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

// 测试 post 请求 发送 formData 数据
export const testPostFormData = (data) => request.post("/test/formData", data);

```

##	根据接口自定义请求器

```js
import { Requestor } from 'll-request-lib/src/request-core/interface'

// 自定义请求器
class MyRequestor implement Requestor {
  ...
}
```

