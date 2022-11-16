DROP TABLE IF EXISTS books;



CREATE TABLE books (
    id serial PRIMARY KEY, 
    title varchar(20),
    isbn varchar(20)

);

INSERT INTO books (title, isbn) VALUES ('Brave New World', 9781604135794);
INSERT INTO books (title, isbn) VALUES ('Island', 9780701108038);