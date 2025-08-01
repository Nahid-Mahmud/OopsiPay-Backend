import { Request, Response } from "express";
import StatusCodes from "http-status-codes";

const notFound = (req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: `Cannot find ${req.originalUrl} on this server!`,
  });
};
export default notFound;
