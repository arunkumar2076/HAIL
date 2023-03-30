import { Request, Response } from 'express';
export const setHeader = (req: Request, res: Response, next: () => void) => {
  const originAllow = process.env.ENV == 'dev' ? '*' : process.env.ORIGIN_ALLOW;

  res.setHeader('Access-Control-Allow-Origin', originAllow);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type',
  );
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Content-Security-Policy', "frame-ancestors 'none'");
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload',
  );
  res.setHeader('permissions-policy', 'geolocation=(), interest-cohort=()');
  next();
};
