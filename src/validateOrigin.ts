import { HttpException, HttpStatus } from '@nestjs/common';
const whitelist = [undefined];
export const validateOrigin = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new HttpException('Invalid ORIGIN.', HttpStatus.FORBIDDEN));
    }
  },
};
