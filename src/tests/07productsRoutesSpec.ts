// // in this files we are testing all routes involving products

import { Product, Product_handlers } from '../models/product';
import { Users, Users_handler } from '../models/users';
import { Orders_product, Orders, orders_handler } from '../models/orders';

import client from '../database';

import { app } from '../server';

import supertest from 'supertest';

const request = supertest(app);

const user = new Users_handler();
const order = new orders_handler();
const product = new Product_handlers();

let token: string;

describe('Test product routes logic', () => {
  //create user object that we will pass to create method like the body we send via postman, should match the real model.
  const userObject: Users = {
    f_name: 'f_name test',
    l_name: 'l_name test',
    user_name: 'user_name test',
    password: 'test pass',
    age: 20,
  };

  const productObject: Product = {
    name: 'test product',
    price: 100,
    category: 'test category',
  };

  //this is the body for creating new row inside orders_products table
  const newOrdersProducts: Orders_product = {
    quantity: 2,
    order_id: 1,
    product_id: 1,
  };

  beforeAll(async () => {
    //create user for testing
    const newUser = await user.create(userObject);
    token = newUser;

    //create test order with test user id
    const newOrder = await order.create(1);
  });

  afterAll(async () => {
    const conn = await client.connect();

    const SQLDeleteUsers = 'DELETE FROM users;';
    const SQLAlterUserSequence = 'ALTER SEQUENCE users_id_seq RESTART WITH 1;';
    const SQLDeleteOrders = 'DELETE FROM orders;';
    const SQLAlterOrders = 'ALTER SEQUENCE orders_id_seq RESTART WITH 1;';

    const SQLDeleteProducts = 'DELETE FROM product;';
    const SQLAlterProductSequence =
      'ALTER SEQUENCE product_id_seq RESTART WITH 1;';

    const SQLDeleteOrders_products = 'DELETE FROM orders_products;';
    const SQLAlterOrders_productsSequence =
      'ALTER SEQUENCE orders_products_id_seq RESTART WITH 1;';

    // const SQLDeleteOrders_Products = "DELETE FROM orders_products;";
    // const SQLAlterOrders_productsSeq = "ALTER SEQUENCE orders_products_id_seq RESTART WITH 1;";

    //we need to delete orders_products table because we will create an instance inside it later for serviceMethods.userDashboard() method
    const alterOrdersProductSeq = await conn.query(
      SQLAlterOrders_productsSequence
    );
    const deleteOrders_Products = await conn.query(SQLDeleteOrders_products);

    const alterProductSeq = await conn.query(SQLAlterProductSequence);
    const deleteProduct = await conn.query(SQLDeleteProducts);

    const alterOrderSeq = await conn.query(SQLAlterOrders);
    const deleteOrder = await conn.query(SQLDeleteOrders);

    const alterUserSeq = await conn.query(SQLAlterUserSequence);
    const deleteUsers = await conn.query(SQLDeleteUsers);

    conn.release();
  });

  it('/createProduct route creates new products successfully', async () => {
    const res = await request
      .post('/createProduct')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(productObject);

    expect(res.body.name).toEqual('test product');
    expect(res.body.price).toEqual(100);
    expect(res.body.category).toEqual('test category');
  });

  it('/allProducts returns all products successfully ', async () => {
    const res = await request
      .get('/allProducts')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    //we need to index into body because body is an array of rows returned from the table.
    expect(res.body[0].name).toEqual('test product');
    expect(res.body[0].price).toEqual(100);
    expect(res.body[0].category).toEqual('test category');
  });

  it('/showProduct/:id returns specific product', async () => {
    const res = await request
      .get('/showProduct/1')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.name).toEqual('test product');
    expect(res.body.price).toEqual(100);
    expect(res.body.category).toEqual('test category');
  });

  it('/deleteProduct/:id deletes specific product', async () => {
    const res = await request
      .delete('/deleteProduct/1')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.name).toEqual('test product');
    expect(res.body.price).toEqual(100);
    expect(res.body.category).toEqual('test category');
  });

  it('orders_handler.addToOrder() methods adds row inside orders_products table to be used later in dashboard() model', async () => {
    //create new product because we deleted our only on at the previous step and we need one at least to add new row at orders_products table
    //note that the new product will be at id = 2, because the product sequence is not altered yet
    const secondProduct = await product.create(productObject);

    //add + 1 to product id , because this is the second product
    const newOrders_products = await order.addToOrder(
      newOrdersProducts.quantity,
      newOrdersProducts.order_id,
      newOrdersProducts.product_id + 1
    );

    expect(parseInt(newOrders_products.order_id as unknown as string)).toEqual(
      1
    );
    expect(
      parseInt(newOrders_products.product_id as unknown as string)
    ).toEqual(2);
    expect(newOrders_products.quantity).toEqual(2);
  });

  //this route returns all orders data for specific user
  it("'/userDashboard/:id route returns all order details for specific user", async () => {
    //after we created the instance inside orders_products, now we can test our dashboard.
    const res = await request
      //get orders info for user with id = 1
      .get('/userDashboard/1')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(parseInt(res.body.user_id)).toEqual(1);
    expect(res.body.user_name).toEqual('user_name test');
    expect(res.body.order_status).toEqual('open');
    expect(res.body.order_id).toEqual(1);
    expect(parseInt(res.body.product_id as string)).toEqual(2);
    expect(res.body.product_name).toEqual('test product');
    expect(res.body.product_name).toEqual('test product');
    expect(res.body.product_quantity).toEqual(2);
  });
});
