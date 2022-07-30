// // in this file I will test all user handler routes to check HTTP requests

import { response } from 'express';
import supertest from 'supertest';
import client from '../database';
import { Users, Users_handler } from '../models/users';
import { app } from '../server';

const request = supertest(app);

const user = new Users_handler();

let token: string;

describe('test user routes logic', () => {
  const userObject: Users = {
    f_name: 'test f_name',
    l_name: 'test l_name',
    user_name: 'test user_name',
    password: 'test pass',
    age: 30,
  };

  beforeAll(async () => {
    const newUser = await user.create(userObject);
    token = newUser;
  });

  afterAll(async () => {
    const conn = await client.connect();

    const SQLDeleteUsers = 'DELETE FROM users;';
    const SQLAlterSeq = 'ALTER SEQUENCE users_id_seq RESTART WITH 1;';

    const alterSeq = await conn.query(SQLAlterSeq);
    const deleteUsers = await conn.query(SQLDeleteUsers);

    conn.release();
  });

  it('authenticateUser test user input correct', async () => {
    const res = await request
      .get('/authenticateUser')
      .set('Content-Type', 'application/json')
      .send({
        user_name: 'test user_name',
        password: 'test pass',
      });

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual('your input data is correct');
  });
  it('authenticateUser return null if wrong user input ', async () => {
    const res = await request
      .get('/authenticateUser')
      .set('Content-Type', 'application/json')
      .send({
        user_name: 'wrong test user_name',
        password: 'wrong test pass',
      });

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual(null);
  });
  it('createUser returns token', async () => {
    const res = await request
      .post('/createUser')
      .set('Content-Type', 'application/json')
      .send({
        f_name: 'test f_name 2',
        l_name: 'test l_name 2',
        user_name: 'test user_name 2',
        password: 'test pass 2',
        age: 40,
      });
    //this route returns newly created user token
    token = res.body.data;

    expect(res.status).toBe(200);
  });
  it('/showAllUsers returns all the users correctly', async () => {
    const res = await request
      .get('/showAllUsers')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toEqual(2);
  });
  it("'/showOneUser/:id' returns one specific user correctly", async () => {
    const res = await request
      .get('/showOneUser/1')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.data.f_name).toEqual('test f_name');
    expect(res.body.data.l_name).toEqual('test l_name');
    expect(res.body.data.user_name).toEqual('test user_name');
    expect(res.body.data.age).toEqual(30);
  });
  it('/updateUser successfully update existing user', async () => {
    const res = await request
      .post('/updateUser')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        f_name: 'update test f_name',
        user_name: 'update test user_name',
        age: 18,
        l_name: 'update test l_name',
      });

    expect(res.body.data.f_name).toEqual('update test f_name');
    expect(res.body.data.user_name).toEqual('update test user_name');
    expect(res.body.data.age).toEqual(18);
    expect(res.body.data.l_name).toEqual('update test l_name');
  });
  it('/deleteUser successfully deletes a specific user', async () => {
    const res = await request
      .delete('/deleteUser')
      .set('Content-Type', 'application/json')
      // this is the token for user of id 2 (second user) the updated one, so check for the updated values
      .set('Authorization', `Bearer ${token}`)
      .send({
        token,
      });

    expect(res.body.data.f_name).toEqual('update test f_name');
    expect(res.body.data.user_name).toEqual('update test user_name');
    expect(res.body.data.age).toEqual(18);
    expect(res.body.data.l_name).toEqual('update test l_name');
  });
});
