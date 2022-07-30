CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    status VARCHAR(15) DEFAULT 'open',
    user_id BIGINT REFERENCES users(id) NOT NULL
);
