import {type Response } from "express";

export class ApiResponse<T> {
  constructor(
    public success: boolean,
    public message: string,
    public data?: T,
    public meta?: unknown
  ) {}

  send(res: Response, statusCode = 200) {
    return res.status(statusCode).json({
      success: this.success,
      message: this.message,
      data: this.data ?? null,
      meta: this.meta ?? null,
    });
  }
}