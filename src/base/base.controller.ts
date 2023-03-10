import { ManagedError } from "@/models/error.model";
import { Pagination, ResponsePayload } from "@/models/response.model";
import autoBind from "auto-bind";
import express from "express";

class BaseController {
  protected defaultSuccessMsg = "Request success.";
  protected defaultFailMsg = "Request fails.";
  protected name: string;

  constructor(name: string) {
    this.name = name;
    autoBind(this);
  }

  protected success<T>(req: express.Request, res: express.Response) {
    return (data?: T, message?: string): void => {
      const finalMessage = message || this.defaultFailMsg;
      const finalData = data ? { data } : { data: null };

      const responsePayload = new ResponsePayload<T>(
        200,
        finalMessage,
        finalData
      );
      res.status(200).send(responsePayload);
    };
  }

  protected fail<T>(req: express.Request, res: express.Response) {
    return (data?: T, message?: string): void => {
      const finalMessage = message || this.defaultFailMsg;
      const finalData = data ? { data } : { data: null };
      const responsePayload = new ResponsePayload<T>(
        500,
        finalMessage,
        finalData
      );
      res.status(500).send(responsePayload);
    };
  }

  protected paginate<T>(req: express.Request, res: express.Response) {
    return (
      data: T,
      pagination: Pagination,
      statusId?: number,
      message?: string
    ): void => {
      const finalMessage = message || this.defaultSuccessMsg;
      const finalData = {
        data: { list: data, pagination, statusId },
      };
      const responsePayload = new ResponsePayload<T>(
        200,
        finalMessage,
        finalData
      );
      res.status(200).send(responsePayload);
    };
  }

  protected getManagedError(error: unknown): ManagedError {
    return new ManagedError(this.name, error);
  }
}

export default BaseController;
