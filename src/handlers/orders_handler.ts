// // this file will handle all of the orders methods to the target route
import { orders_handler } from '../models/orders';

//this class contains userDashboard which returns all the order and product information's about a specific user.
import { serviceMethods } from '../services/dashboard';

//create an instance of orders_handler to access all it's methods using the instance.
const orders = new orders_handler();

//import auth middleware, to authenticate user using tokens before invoking certain sensitive routes
import { authHeader } from '../services/authenticate';

//create an instance of serviceMethods to access all it's methods using the instance.
const services = new serviceMethods();

import express, { Request, Response } from 'express';

//use this method for error handling instead of copy past at every line.
const errorMethod = (error: unknown) => {
  return new Error(`The Error is : ${error as unknown as string}`);
};

//show all orders in the DB, with their status
const showAllOrders = async (_req: Request, res: Response) => {
  try {
    const result = await orders.index();
    res.json(result);
  } catch (error) {
    throw errorMethod(error);
  }
};

const showOneOrder = async (req: Request, res: Response) => {
  try {
    const result = await orders.show(parseInt(req.params.id));

    res.json(result);
  } catch (error) {
    throw errorMethod(error);
  }
};

//to handle creating new orders for the user to add products to them later
const createOrderHandler = async (req: Request, res: Response) => {
  try {
    //we only need user_id to attach the order to, status of order is default to "open".
    const result = await orders.create(parseInt(req.params.id));
    res.json(result);
  } catch (error) {
    // throw errorMethod(error)
    res.send('make sure that you passed a valid user_id');
  }
};

//to handle the adding new order functionality to order_product table, which is a many to many table between product table and order table.
const addProductToOrder = async (req: Request, res: Response) => {
  const order_id: number = parseInt(req.params.id);
  const product_id: number = req.body.product_id;
  const quantity: number = req.body.quantity;
  try {
    const result = await orders.addToOrder(quantity, order_id, product_id);
    res.json(result);
  } catch (error) {
    // throw errorMethod(error)
    res.send(
      'please make sure that product is available and the order is open !!'
    );
  }
};

const userDashboard = async (req: Request, res: Response) => {
  try {
    const result = await services.userDashboard(parseInt(req.params.id));
    res.json(result);
  } catch (error) {
    res.send(
      'please make sure that this user have an open order with products in it !!'
    );
  }
};

export const ordersRoute = (app: express.Application) => {
  app.get('/showAllOrders', authHeader, showAllOrders);
  app.get('/showOneOrder/:id', authHeader, showOneOrder);
  app.post('/createOrder/:id', authHeader, createOrderHandler);
  app.post('/addToOrder/:id/product', authHeader, addProductToOrder);
  app.get('/userDashboard/:id', userDashboard);
};
