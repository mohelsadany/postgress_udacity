// // in this file I'am testing all users model.

//import book_handlers to test each one of its methods
import { Users_handler } from '../models/users';
import { Users } from '../models/users';

//to create connection with the DB
import client from '../database';

//create an instance from the class to be able to test it's methods and return functions
const user = new Users_handler();

describe('Test that every model inside usersModel is defined', () => {
  it('user.index is defined', () => {
    expect(user.index).toBeDefined();
  });
  it('user.show is defined', () => {
    expect(user.show).toBeDefined();
  });
  it('user.authenticate is defined', () => {
    expect(user.authenticate).toBeDefined();
  });
  it('user.create is defined', () => {
    expect(user.create).toBeDefined();
  });
  it('user.destroy is defined', () => {
    expect(user.destroy).toBeDefined();
  });
  it('user.update is defined', () => {
    expect(user.update).toBeDefined();
  });
});

let token: string;

//in this suite will test user behavior models.
describe('test user CRUD operations logic', () => {
  //create user object that we will pass to create method like the body we send via postman, should match the real model.
  const userObject: Users = {
    f_name: 'f_name test',
    l_name: 'l_name test',
    user_name: 'user_name test',
    password: 'test pass',
    age: 20,
  };

  //this will run before all the tests, we should create our first user in this step so we can find someone to test on later, and this insures that we have user ready because the following tests order could change because it asynchronous functions.
  beforeAll(async () => {
    //using create method and the object we created as an argument for create model which takes user info as an object.
    const newUser = await user.create(userObject);

    //token variable will contain the return of create() which is the user token.
    token = newUser;
  });

  //this will help us delete the table and make it ready for the rest of tests inside this file and others because they are all conducted on the same DB and tables
  afterAll(async () => {
    const conn = await client.connect();

    //delete all created users inside users table to be fresh for other tests,
    const sqlDELETE = 'DELETE FROM users;';

    // after deleting all users, the id sequence would't start from 1 because when rows deleted the id sequence keep counting on, but we need in other test's after this one the sequence to start from 1 again, so we should alter the sequence like this.
    const sqlAlterTable = 'ALTER SEQUENCE users_id_seq RESTART WITH 1;';

    //we need now to perform the previous two SQL queries.
    const Alter = await conn.query(sqlAlterTable);
    const Delete = await conn.query(sqlDELETE);

    conn.release();
  });

  it('user should be created', async () => {
    //now we are testing show() model that returns one user with id no.1 , that's why we altered the sequence because we depend on it in our tests
    const showOneUser = await user.show(1);

    //this line doesn't have any functionality, just to learn that if Iam using UUID instead of serial id that I can store it at my userObject so I can access it later to select this specific user.
    userObject.id = showOneUser.id;

    //AFTER THE USER we created BEEN returned, we can expect the values we entered to be true like age.
    expect(showOneUser.age).toBe(20);
    expect(showOneUser.f_name).toBe('f_name test');
    expect(showOneUser.l_name).toBe('l_name test');
    expect(showOneUser.user_name).toBe('user_name test');
  });

  it('Authenticate user returns correct response', async () => {
    const auth = await user.authenticate('user_name test', 'test pass');

    //if user_name and password is correct, authenticate should return string "your input data is correct"
    expect(auth).toBe('your input data is correct');
  });
  it('test Authenticate() if the user input wrong user_name or password', async () => {
    const auth = await user.authenticate('wrong user_name', 'wrong test pass');

    //if user_name and password is wrong, authenticate should return null
    expect(auth).toBe(null);
  });
  it('index() should return all the users inside table without any arguments', async () => {
    const indexUsers = await user.index();
    expect(indexUsers[0].age).toBe(20);
    expect(indexUsers[0].f_name).toBe('f_name test');
    expect(indexUsers[0].l_name).toBe('l_name test');
    expect(indexUsers[0].user_name).toBe('user_name test');
  });
  it('user.destroy() should delete specific user ', async () => {
    //this line will delete the only user we created previously
    const deleteUser = await user.destroy(token);

    //use index()method to check for all the users, since we just deleted our only user then indexUsers array length should be zero
    const indexUsers = await user.index();

    expect(indexUsers.length).toEqual(0);
  });
});
