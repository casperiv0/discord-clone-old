import { NextFunction, Response } from "express";
import { isValidObjectId } from "mongoose";
import IRequest from "../interfaces/IRequest";
import logger from "../utils/logger";
import { errorObj } from "../utils/utils";

const useValidObjectId = (...params: string[]) => (
  req: IRequest,
  res: Response,
  next: NextFunction,
): void | Response => {
  try {
    let valid = true;

    for (let i = 0; i < params.length; i++) {
      if (!isValidObjectId(req.params[params[i]])) {
        valid = false;
        break;
      } else {
        continue;
      }
    }

    if (!valid) {
      return res.json(errorObj("An invalid objectId was provided"));
    }

    next();
  } catch (e) {
    logger.error("USE_VALID_OBJECT_ID", e);
  }
};

export default useValidObjectId;
