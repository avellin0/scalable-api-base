import { Response } from "express";

export interface HttpErrorInterface {
  statusCode: number;
  code: string;
  details: string;
  path: string;
}

type ErrorCode =
  | "BAD_REQUEST"
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "CONFLICT"
  | "FORBIDDEN"
  | "TOO_MANY_REQUESTS"
  | "INTERNAL_SERVER_ERROR";

export class HttpError extends Error {
  statusCode: number;
  code: ErrorCode;
  details?: unknown;
  path?: string;

  constructor(
    statusCode: number,
    message: string,
    code: ErrorCode,
    options?: {
      path?: string;
      details?: unknown;
    },
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.path = options?.path;
    this.details = options?.details;
  }

  static BadRequest(options?: { path?: string; details?: unknown }) {
    return new HttpError(
      400,
      "Bad request",
      "BAD_REQUEST",
      options,
    );
  }

  static Unauthorized(options?: { path?: string; details?: unknown }) {
    return new HttpError(
      401,
      "Unauthorized",
      "UNAUTHORIZED",
      options,
    );
  }

  static Forbidden(options?: { path?: string; details?: unknown }) {
    return new HttpError(
      403,
      "Forbidden",
      "FORBIDDEN",
      options,
    );
  }

  static NotFound(options?: { path?: string; details?: unknown }) {
    return new HttpError(
      404,
      "Resource not found",
      "NOT_FOUND",
      options,
    );
  }

  static Conflict(options?: { path?: string; details?: unknown }) {
    return new HttpError(
      409,
      "Conflict",
      "CONFLICT",
      options,
    );
  }

  static Validation(options?: { path?: string; details?: unknown }) {
    return new HttpError(
      422,
      "Validation failed",
      "VALIDATION_ERROR",
      options,
    );
  }

  static TooManyRequests(options?: { path?: string; details?: unknown }) {
    return new HttpError(
      429,
      "Too many requests",
      "TOO_MANY_REQUESTS",
      options,
    );
  }

  static Internal(options?: { path?: string; details?: unknown }) {
    return new HttpError(
      500,
      "Internal server error",
      "INTERNAL_SERVER_ERROR",
      options,
    );
  }
}

type ErrorHandler = (error: HttpError, res: Response) => Response;

export const errorHandlers: Record<ErrorCode, ErrorHandler> = {
  BAD_REQUEST: (error: any, res: Response) =>
    res.status(error.statusCode).json({
      BadRequest: error.details,
    }),

  VALIDATION_ERROR: (error: any, res: Response) =>
    res.status(error.statusCode).json({
      error: error.details,
    }),

  NOT_FOUND: (error: any, res: Response) =>
    res.status(error.statusCode).json({
      error: error.details,
    }),

  UNAUTHORIZED: (error: any, res: Response) =>
    res.status(error.statusCode).json({
      error: error.details,
    }),

  CONFLICT: (error: any, res: Response) =>
    res.status(error.statusCode).json({
      error: error.details,
    }),

  FORBIDDEN: (error: any, res: Response) =>
    res.status(error.statusCode).json({
      error: error.details,
    }),

  TOO_MANY_REQUESTS: (error: any, res: Response) =>
    res.status(error.statusCode).json({
      error: error.details,
    }),

  INTERNAL_SERVER_ERROR: (error: any, res: Response) =>
    res.status(error.statusCode).json({
      error: error.details,
    }),
};
