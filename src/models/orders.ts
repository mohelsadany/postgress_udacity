//this file will contain the class methods for orders table and order_products table
//we want to show all orders, delete, add new order

import client from '../database';

//import dotenv to use variable from .env file for hashing and salt, and grant access to process.env object
import dotenv from 'dotenv';

dotenv.config();

//use this method for error handling instead of copy past at every line.
const errorMethod = (error: unknown) => {
  return new Error(`The Error is : ${error as unknown as string}`);
};

//type for the response of "orders" table for a specific user that is the logged in one.
export type Orders = {
  id?: number;
  status: string;
  user_id: number;
};

//type for the new created orders to order_product table
export type Orders_product = {
  quantity: number;
  order_id: number;
  product_id: number;
};

//this the class that will contain
export class orders_handler {
  async index(): Promise<Orders[]> {
    try {
      const conn = await client.connect();
      const sql = `SELECT * FROM orders;`;
      const result = await client.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      throw errorMethod(error);
    }
  }

  async show(id: number): Promise<Orders> {
    try {
      const conn = await client.connect();
      const sql = `SELECT * FROM orders WHERE id = $1;`;

      const result = await conn.query(sql, [id]);

      conn.release();
      return result.rows[0];
    } catch (error) {
      throw errorMethod(error);
    }
  }

  // create method creates new order for specific user, so we can attach product to it latter using product_orders table using addOrder method
  async create(userId: number): Promise<Orders> {
    try {
      const conn = await client.connect();
      const sql = `INSERT INTO orders (user_id) VALUES ($1) RETURNING *;`;
      const result = await client.query(sql, [userId]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw errorMethod(error);
    }
  }

  //this method will add orders to orders_products table to create many to many relation between orders and products tables.
  async addToOrder(
    quantity: number,
    order_id: number,
    product_id: number
  ): Promise<Orders_product> {
    //add logic to check if the order is open first before adding to it
    try {
      const conn = await client.connect();
      const sql = `SELECT status FROM orders WHERE id = $1;`;
      const result = await conn.query(sql, [order_id]);
      const status = result.rows[0];
      conn.release();

      //check if the is closed
      if (status !== 'open') {
        throw new Error(
          `Could not add product ${product_id} to order ${order_id} because the order is closed.`
        );
      }
    } catch (error) {
      errorMethod(error);
    }
    //if the order is still open, then add product to it
    try {
      const conn = await client.connect();
      const sql = `INSERT INTO orders_products (quantity, order_id, product_id) VALUES ($1, $2, $3) RETURNING *;`;
      const result = await client.query(sql, [quantity, order_id, product_id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw errorMethod(error);
    }
  }
}
