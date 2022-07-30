// // this file will contain all the authentication models
import { Response, Request, NextFunction } from 'express';

//import jwt to check tokens before create new books.
import jwt from 'jsonwebtoken';

//import dotenv and initialize
import dotenv from 'dotenv';
dotenv.config();

//'auth' is a middleware that requires token from the user to invoke certain sensitive routes that
export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    //.verify() returns true or false
    jwt.verify(req.body.token, process.env.TOKEN_PASS as string);

    //use next() method to go to the next method, to prevent program hanging
    next();
  } catch (error) {
    //401 for unauthorized
    res.status(401);
    //give the user feedback on the problem
    res.send(
      `you are not authorized!! sign in first, then provide your token..`
    );
  }
};

//this function gets the embedded token from within the "req.headers.authorization" object sent by the client header, then return it to the API so we can use the token to verify the user.
export const getToken = (req: Request, _res: Response) => {
  //"authorizationHeader" gets the value of key "authorization" sent by "headers" object which is sent by the client and part of the request object.
  //better understanding in this video "https://www.youtube.com/watch?v=Ku3eJnOfmIo"
  const authorizationHeader = req.headers.authorization as string;

  //"token" edit on the "authorizationHeader" string which is like "Bearer <token>", so there's a "space" between "Bearer" and "token" so using split(" ") and space as arg, we get an array and the second element of iy is the token.
  const token = authorizationHeader.split(' ')[1];

  return token;
};

//'auth' is a middleware that requires token from the user to invoke certain sensitive routes that, we get the token straight from headers object, without the need of the user providing any thing to
export const authHeader = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = getToken(req, res);
    //.verify() returns true or false
    jwt.verify(token, process.env.TOKEN_PASS as string);

    //use next() method to go to the next method, to prevent program hanging
    next();
  } catch (error) {
    //401 for unauthorized
    res.status(401);
    //give the user feedback on the problem
    res.send(
      `you are not authorized!! sign in first, then provide your token..`
    );
  }
};
