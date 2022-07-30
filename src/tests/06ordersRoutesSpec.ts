// // in this file we are testing all orders routes

import { Orders, orders_handler } from '../models/orders';
import { Users, Users_handler } from '../models/users';

import supertest from 'supertest';

import { app } from '../server';
import client from '../database';

const request = supertest(app);

const user = new Users_handler();
const order = new orders_handler();

let token: string;

describe('Test order routes logic', () => {
  const userObject: Users = {
    f_name: 'test f_name',
    l_name: 'test l_name',
    user_name: 'test user_name',
    password: 'test pass',
    age: 30,
  };

  beforeAll(async () => {
    //newUser id =1
    //user.create returns user token
    const newUser = await user.create(userObject);
    token = newUser;
  });

  afterAll(async () => {
    const conn = await client.connect();

    const SQLDeleteUsers = 'DELETE FROM users;';
    const SQLAlterUserSeq = 'ALTER SEQUENCE users_id_seq RESTART WITH 1;';
    const SQLDeleteAlter = 'DELETE FROM orders;';
    const SQLAlterOrders = 'ALTER SEQUENCE orders_id_seq RESTART WITH 1;';

    const alterOrderSeq = await conn.query(SQLAlterOrders);
    const deleteOrders = await conn.query(SQLDeleteAlter);
    const alterUserSeq = await conn.query(SQLAlterUserSeq);
    const deleteUser = await conn.query(SQLDeleteUsers);

    conn.release();
  });

  it('orders.create() creates new orders successfully', async () => {
    const res = await request
      //1 is the user id attached to this new order
      .post('/createOrder/1')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    //in order handler the return not inside data object, but inside body directly, this structure dosen't have any functionality but to learn that it's possible
    //parseInt the returned user_id from the
    expect(parseInt(res.body.user_id)).toEqual(1);
    expect(res.body.status).toEqual('open');
  });
  it('/showAllOrders route returns all orders', async () => {
    const res = await request
      .get('/showAllOrders')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    //index into body because /showAllOrders returns array of objects
    expect(parseInt(res.body[0].user_id)).toEqual(1);
    //length should equal 1 because we only created one order
    expect(parseInt(res.body.length)).toEqual(1);
  });
  it('/showOneOrder/:id route returns one specific order', async () => {
    const res = await request
      .get('/showOneOrder/1')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    //index into body because /showAllOrders returns array of objects
    expect(parseInt(res.body.user_id)).toEqual(1);
  });
});
