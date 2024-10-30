import { Requestor } from "../request-core/interface";
import { RequestFetch } from "./request-fetch";
import { RequestAxios } from "./request-axios";

// fetch 请求器
export const fetchRequestor: Requestor = new RequestFetch();

// axios 请求器
export const axiosRequestor: Requestor = new RequestAxios();
