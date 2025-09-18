import { Request, Response, NextFunction } from 'express';

// middleware that check if the ip of the client is one of the alarm devices
export const authorizeDevice = (req: Request, res: Response, next: NextFunction): void => {
  const ip = req.ip ?? 'undefined';
  const IP_REGEX = process.env.IP_REGEX;
  
  if (!IP_REGEX) {
    console.error('IP_REGEX environment variable not defined');
    return;
  }
  
  // ====================================================================================
  // ::1 AND ::ffff:172.18.0.1 ARE ONLY FOR DEVELOPMENT PURPOSE. REMOVE IT IN PRODUCTION!
  // ====================================================================================
  // const isAuthorized = ip?.match(IP_REGEX) ?? (ip === '::1' || ip === '::ffff:172.18.0.1');
  
  const isAuthorized = new RegExp(IP_REGEX).test(ip);

  if (!isAuthorized) {
    res.status(403).json({ message: 'Forbidden resource' });
    console.log(req.ip);
  } else {
    next();
  }
}