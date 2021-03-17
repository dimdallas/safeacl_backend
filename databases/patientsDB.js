const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "1234",
    database: "patients",
    host: "localhost",
    port: 5432
});

// console.log(pool)
module.exports = pool;