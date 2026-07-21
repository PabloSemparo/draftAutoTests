import {
  APIRequestContext,
  APIResponse,
} from "@playwright/test";
import { randomUUID } from "crypto";

import { ApiRequest } from "./apiRequest";
import { ApiResponse as ClientResponse } from "./apiResponse";

export class ApiClient {
  constructor(
    protected readonly request: APIRequestContext,
    private readonly token?: string
  ) {}

  protected async get<T>(
    data: ApiRequest
  ): Promise<ClientResponse<T>> {
    return this.send<T>("GET", data);
  }

  protected async post<T>(
    data: ApiRequest
  ): Promise<ClientResponse<T>> {
    return this.send<T>("POST", data);
  }

  protected async put<T>(
    data: ApiRequest
  ): Promise<ClientResponse<T>> {
    return this.send<T>("PUT", data);
  }

  protected async patch<T>(
    data: ApiRequest
  ): Promise<ClientResponse<T>> {
    return this.send<T>("PATCH", data);
  }

  protected async delete<T>(
    data: ApiRequest
  ): Promise<ClientResponse<T>> {
    return this.send<T>("DELETE", data);
  }

  private async send<T>(
    method: string,
    data: ApiRequest
  ): Promise<ClientResponse<T>> {
    const headers = {
      "Content-Type": "application/json",
      "X-Correlation-Id": randomUUID(),
      ...(this.token && {
        Authorization: `Bearer ${this.token}`,
      }),
      ...data.headers,
    };

    console.log("\n========================================");
    console.log(`${method} ${data.url}`);
    console.log("Headers:");
    console.log(headers);

    if (data.params) {
      console.log("Query Params:");
      console.log(data.params);
    }

    if (data.body) {
      console.log("Request Body:");
      console.log(JSON.stringify(data.body, null, 2));
    }

    const started = Date.now();

    const response: APIResponse = await this.request.fetch(data.url, {
      method,
      headers,
      params: data.params,
      data: data.body,
      timeout: data.timeout ?? 30000,
    });

    const elapsed = Date.now() - started;

    let body: T;

    try {
      body = (await response.json()) as T;
    } catch {
      body = {} as T;
    }

    console.log(`Status: ${response.status()}`);
    console.log(`Time: ${elapsed} ms`);

    console.log("Response:");

    console.log(
      JSON.stringify(body, null, 2)
    );

    console.log("========================================\n");

    return {
      raw: response,
      body,
    };
  }
}