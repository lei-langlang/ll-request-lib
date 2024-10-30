import { Requestor } from "../request-core/interface";
import { RequestFetch } from "./request-fetch";

// fetch 请求器
export const fetchRequestor: Requestor = new RequestFetch();
