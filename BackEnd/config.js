module.exports = {
    dev:{
        connectionString: 'postgresql://postgres:docker@127.0.0.1:5432/books',
        port: '3001'
    },
    production:{
        connectionString: process.env.POSTGRES_CONNECTION_STRING + "?ssl=true",
        port: process.env.PORT
    }
}