// // in this file I'am testing all product models

//import all model classes needed to test product models.
import { Product, Product_handlers } from '../models/product';
import { Users, Users_handler } from '../models/users';
import { orders_handler } from '../models/orders';
import client from '../database';

//create an instance from the class to be able to test it's methods and return functions
const product = new Product_handlers();
const user = new Users_handler();
const order = new orders_handler();

describe('Test that every model inside productModel is defined', () => {
  it('product.index() is defined', () => {
    expect(product.index).toBeDefined();
  });
  it('product.show() is defined', () => {
    expect(product.show).toBeDefined();
  });
  it('product.allProductsByCategory() is defined', () => {
    expect(product.allProductsByCategory).toBeDefined();
  });
  it('product.create() is defined', () => {
    expect(product.create).toBeDefined();
  });
  it('product.delete() is defined', () => {
    expect(product.delete).toBeDefined();
  });
});

describe('test product models CRUD operations logic', () => {
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

  beforeAll(async () => {
    //create user for testing
    const newUser = await user.create(userObject);

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

  it('product.create() creates product correctly', async () => {
    const newProduct = await product.create(productObject);

    expect(newProduct.name).toEqual('test product');
    expect(newProduct.price).toEqual(100);
    expect(newProduct.category).toEqual(productObject.category);
  });
  it('product.index() shows all products', async () => {
    const showAllProducts = await product.index();

    //check for the first product
    expect(showAllProducts[0].name).toEqual('test product');
    expect(showAllProducts[0].category).toEqual('test category');

    //instead of hard coding the target value we can access the value we gave the product test object "productObject" by calling the key
    expect(showAllProducts[0].price).toEqual(productObject.price);
  });
  it('product.show() show one specific product', async () => {
    //pass specific product id to get
    const showOneProduct = await product.show(1);

    //instead of hard coding the target value we can access the value we gave the product test object "productObject" by calling the key
    expect(showOneProduct.name).toEqual(productObject.name);
    expect(showOneProduct.price).toEqual(productObject.price);
    expect(showOneProduct.category).toEqual(productObject.category);
  });

  it('product.delete() deletes the product with the id', async () => {
    //delete take product id
    const deleteOneProduct = await product.delete(1);

    //instead of hard coding the target value we can access the value we gave the product test object "productObject" by calling the key
    expect(deleteOneProduct.name).toEqual(productObject.name);
    expect(deleteOneProduct.price).toEqual(productObject.price);
    expect(deleteOneProduct.category).toEqual(productObject.category);
  });
  it('order.addToOrder() adds product to an open order by user', async () => {
    //create new product because we deleted our only on at the previous step and we need one at least to add new row at orders_products table
    //note that the new product will be at id = 2, because the product sequence is not altered yet
    const newProduct = await product.create(productObject);

    //addToOrder takes 1)product quantity 2) order_id 3) product_id
    const addProductToOrder = await order.addToOrder(1, 1, 2);
    expect(parseInt(addProductToOrder.quantity as unknown as string)).toEqual(
      1
    );
    expect(parseInt(addProductToOrder.product_id as unknown as string)).toEqual(
      2
    );
    expect(parseInt(addProductToOrder.order_id as unknown as string)).toEqual(
      1
    );
  });
});
