import { Injectable, NestMiddleware } from '@nestjs/common';
import { error } from 'console';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class HeaderMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {

    try {
      const apiKey = req.headers.api_key;
      if (apiKey === "diego123") {
        console.log(req.headers)
        next();
      } 
      else {
        res.status(403);
      }
      // if (!apiKey) {
      //   return res.status(401).json({
      //     error: "API key missing"
      //   });
      // }      
    } catch (e) {
      res.status(403);
      res.send({
        error: "ALGO OCURRIO EN EL CUSTOM HEADER"
      })
    }
    next();
  }
}
