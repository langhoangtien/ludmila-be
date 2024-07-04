import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class DelayResponseMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Trì hoãn phản hồi trong 3 giây
    setTimeout(next, 100);
  }
}
