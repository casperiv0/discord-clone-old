import { Request } from "express";

interface IRequest extends Request {
  user?: { _id: string };
}

export default IRequest;
