
import express, { Request, Response, NextFunction } from "express";

const router = express.Router();

const promiseFunc = async () => {
  return new Promise((resolve) => {
    resolve('312');
  });
}

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  res.send(await promiseFunc());
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  res.send('hello world');
});

export default router;
