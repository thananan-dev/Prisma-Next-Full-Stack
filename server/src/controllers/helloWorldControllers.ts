import { Request, Response } from "express";

const helloWorld = {
  GetHelloWorld: (req: Request, res: Response) => {
    return res.status(200).json({ message: "Hello World" });
  },
};

export default helloWorld;
