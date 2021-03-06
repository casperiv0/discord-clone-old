import { Request } from "express";

interface IRequest extends Request {
  /**
   * The user id of the authenticated user
   */
  user?: string;
}

export default IRequest;
