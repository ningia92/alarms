import { Request, Response, NextFunction } from 'express';

// middleware that check if the ip of the client is one of the alarm devices
export const authorizeDevice = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip;
  const IP_REGEX = process.env.IP_REGEX;

  if (!IP_REGEX) {
    console.error('IP_REGEX environment variable si not defined');
    throw new Error('Server configuration error');
  }

  // =================================================================================
  // ::1 IS LOCALHOST AND IT IS ONLY FOR DEVELOPMENT PURPOSE. REMOVE IT IN PRODUCTION!
  // =================================================================================
  const isAuthorized = ip?.match(IP_REGEX) ?? ip === '::1';

  if (!isAuthorized) {
    const error = new Error('Forbidden endpoint');
    error.statusCode = 403;
    throw error;
  } else {
    next();
  }
}