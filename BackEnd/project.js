const express = require('express')
const app = express()
app.use(express.json());
let cors = require("cors");
app.use(cors());
const { Client } = require('pg');

const config = require('./config')[process.env.NODE_ENV||"dev"]
const port = config.port;

const client = new Client({
    connectionString: config.connectionString,
});

client.connect();

//GETS all books
app.get('/api/books', (req, res) => {
    client.query('SELECT * FROM books')
    .then(result => {
        // console.log(result.rows[0])
        res.send(result.rows);
    })
    .catch(e => console.error(e.stack))
});

//GETS books by ID
app.get('/api/books/:id', (req, res) => {
    client.query(`SELECT * FROM books WHERE id = ${req.params.id}`)
    .then(result => {
        console.log(result.rows[0])
        res.send(result.rows);
    })
    .catch(e => console.error(e.stack))
});

//POST books into databse
app.post('/api/books', (req, res) => {
    let books = req.body;
    let title = books.title;
    let isbn = books.isbn;
    client.query(`INSERT INTO books (title, isbn) VALUES ('${title}', '${isbn}') RETURNING *`)
    .then(result => {
        res.status(200).send(result.rows);
    })
    .catch(e => console.error(e.stack));
});

//DELETE books by ID
app.delete('/api/books/:id', (req,res, next) => {
    console.log('delete route')
    async function booksById() {
        try {
            const result = await client.query(`DELETE FROM books WHERE id = ${req.params.id} RETURNING *`)
            if (result.rows.length === 0) {res.status(404).send('No books found for that id!')
        } else {
            res.status(200).send(result.rows[0]);
        }
        } catch (e) {
            next(e);
        };
    };
    booksById();
});
// app.delete('/api/books/:id', (req,res, next) => {
//     client.query(`SELECT * FROM books WHERE id = ${req.params.id}`)
//     .then (result => {
//         res.status(200).send(result.rows);
//     })
//     .catch(e => console.error(e.stack))
// });

//PUT books by ID 
app.patch('/api/books/:id', (req, res) => {
    // console.log(req.body);

    client.query(`UPDATE books SET title='${req.body.title}',isbn='${req.body.isbn}' WHERE id = ${req.params.id}`)
      .then(result =>{
        res.status(200).send(result.rows);
      })
      .catch(e => console.error(e.stack));
  });

  //PATCH books by ID 
  app.patch('/api/books/:id', (req, res, next) => {
    let books = req.body;
    let title = books.name;
    let isbn = books.position;
    async function updateBooks() {
        try {
            client.query(`UPDATE employee SET
            title = COALESCE(NULLIF('${title}', ''), title),
            isbn = COALESCE(NULLIF('${isbn}', ''), isbn)

          WHERE id = ${req.params.id};`)

            const result = await client.query(`SELECT * FROM books WHERE id = ${req.params.id}`);
            res.status(201).send('the query is okay');
        } catch (e) {
            next(e);
        };
    };
    updateBooks();
})




app.use((e, req, res, next) =>{
    res.status(500).json(e);
});

app.listen(port, () => { console.log(`listening on port ${port}`)});
