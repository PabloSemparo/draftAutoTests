import { APIResponse } from "@playwright/test";

export interface ApiResponse<T = unknown> {
  raw: APIResponse;
  body: T;
}