CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    f_name VARCHAR(50),
    l_name VARCHAR(50),
    user_name VARCHAR(50) NOT NULL,
    password text NOT NULL ,
    age INTEGER
);
