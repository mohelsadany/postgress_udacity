//this file will contain the services methods that doesn't have direct functionality with CRUD operation

import client from '../database';

//use this method for error handling instead of copy past at every line.
const errorMethod = (error: unknown) => {
  return new Error(`The Error is : ${error as unknown as string}`);
};

export class serviceMethods {
  //userDashboard() will show all the information about orders and products for a specific user
  async userDashboard(id: number) {
    try {
      const conn = await client.connect();
      //to be able to use this query you have to have a user, order and products all related to each others
      const sql = `SELECT users.id as user_id, user_name, status as order_status, orders.id as order_id, orders_products.product_id, product.name as product_name, orders_products.quantity as product_quantity FROM users 
        INNER JOIN orders ON users.id = orders.user_id 
        INNER JOIN orders_products on orders.id = orders_products.order_id 
        INNER JOIN product ON orders_products.product_id = product.id 
        WHERE users.id = ($1) ORDER BY orders_products.quantity;`;

      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw errorMethod(error);
    }
  }
}
