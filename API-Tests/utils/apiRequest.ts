export interface ApiRequest<T = unknown> {
  url: string;
  body?: T;
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
  timeout?: number;
}