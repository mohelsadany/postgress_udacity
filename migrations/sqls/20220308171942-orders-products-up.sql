CREATE TABLE orders_products(
    id SERIAL PRIMARY KEY,
    quantity INTEGER NOT NULL,
    order_id BIGINT NOT NULL REFERENCES orders(id),
    product_id BIGINT NOT NULL REFERENCES product(id)
);