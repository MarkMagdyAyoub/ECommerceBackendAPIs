import { Status } from "../enums/status";
import { ProductResponse } from "./product-response";

export interface ValidationError {
  field:string;
  msg : string;
}

export interface FailResponse {
  status: Status.FAIL;
  data: {
    errors: ValidationError[];
  };
}

export interface ErrorResponse {
  status: Status.ERROR;
  message: string;
}
export type ApiResponse = ProductResponse | FailResponse | ErrorResponse;
