// // in this file I'am testing all order models

//import book_handlers to test each one of its methods
import { orders_handler } from '../models/orders';

//import users class because we need to create new user for our tests
import { Users, Users_handler } from '../models/users';

//serviceMethods to test user dashboard methods
import { serviceMethods } from '../services/dashboard';

//to connect with DB
import client from '../database';

//create an instance from the class to be able to test it's methods and return functions
const order = new orders_handler();
const service = new serviceMethods();
const user = new Users_handler();

describe('Test that every model inside orderModel is defined', () => {
  it('order.index is defined', () => {
    expect(order.index).toBeDefined();
  });
  it('order.show is defined', () => {
    expect(order.show).toBeDefined();
  });
  it('order.addOrder is defined', () => {
    expect(order.addToOrder).toBeDefined();
  });
  it('order.create is defined', () => {
    expect(order.create).toBeDefined();
  });
  it('service.userDashboard is defined', () => {
    expect(service.userDashboard).toBeDefined();
  });
});

describe('test order Models CRUD operations logic', () => {
  //create user object that we will pass to create method like the body we send via postman, should match the real model.
  const userObject: Users = {
    f_name: 'f_name test',
    l_name: 'l_name test',
    user_name: 'user_name test',
    password: 'test pass',
    age: 20,
  };
  //create test user beforeAll tests
  beforeAll(async () => {
    //this line will create test user for us.
    const newUser = await user.create(userObject);
  });

  //delete all created users and alter their id sequences
  afterAll(async () => {
    const conn = await client.connect();

    const SQLDeleteOrders = 'DELETE FROM orders;';
    const SQLDeleteUsers = 'DELETE FROM users CASCADE;';
    const SQLAlterUsersSequence = 'ALTER SEQUENCE users_id_seq RESTART WITH 1;';
    const SQLAlterOrdersSequence =
      'ALTER SEQUENCE orders_id_seq RESTART WITH 1;';

    //Alter the sequence of order id back to 1 after deleting the exiting to ensure new test will start from id =1
    const alterOrdersResult = await conn.query(SQLAlterOrdersSequence);

    //delete all orders inside the table to start fresh
    const deleteOrders = await conn.query(SQLDeleteOrders);

    //delete and alter user sequences and users
    const alterResult = await conn.query(SQLAlterUsersSequence);
    const deleteResult = await conn.query(SQLDeleteUsers);

    conn.release();
  });
  it('test create new order', async () => {
    //order.creat() take user.id to create new order for him, since we created one test user then user id =1
    //order.creat() returns an object of the order details
    const createNewOrder = await order.create(1);

    //order status defaults to "open"
    expect(createNewOrder.status).toBe('open');
    //make sure of order id
    expect(createNewOrder.id).toEqual(1);
  });
  it('orders.index() show all orders', async () => {
    //orders.index() returns array of objects, each object is a row from table.
    const showAllOrders = await order.index();
    expect(showAllOrders[0].status).toEqual('open');
  });
  it('orders.show() returns a specific order', async () => {
    //try to show the 1st order that we created previously
    const showOneOrder = await order.show(1);

    //make sure that the method works fine
    expect(showOneOrder.status).toEqual('open');
  });
});
