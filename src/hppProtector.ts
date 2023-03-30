import { HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

export const hppProtector = (req: Request, res: Response, next: () => void) => {
  const spec = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  if (Object.keys(req.query).length > 20) {
    throw new HttpException('Can not enter query more than 20.', 400);
  }
  Object.entries(req.query).forEach(([key, value]) => {
    if (spec.test(value.toString()) || spec.test(key)) {
      throw new HttpException('Special character not allowed.', 400);
    }
    if (typeof value !== 'string' && Array.isArray(value)) {
      throw new HttpException('Enter only string type in query.', 400);
    }
  });
  next();
};
