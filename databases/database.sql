CREATE DATABASE safeacltest;

--\c into database
-- set extension
CREATE TABLE users(
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);
CREATE TABLE clients(
    client_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    id_num INT,
    age INT,
    height INT,
    email VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    doctor_id uuid NOT NULL
);

INSERT INTO users (username, email, password) VALUES ('a', 'a@a.com', 'aaaa');
INSERT INTO clients (username, email, assword) VALUES ('a', 'a@a.com', 'aaaa');