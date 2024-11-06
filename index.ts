// fetch 请求器
import { FetchRequestor } from "./src/request-impl/request-fetch";
// axios 请求器
import { AxiosRequestor } from "./src/request-impl/request-axios";

// 请求重试
import { useRetry } from "./src/request-core/requqest-retry";
// 请求并发控制
import { useConcurrency } from "./src/request-core/request-concurrency";

export { FetchRequestor, AxiosRequestor, useRetry, useConcurrency };
