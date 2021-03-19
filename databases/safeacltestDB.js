const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "safeacl",
    database: "safeacldocker",
    host: "localhost",
    port: 5004
});

// console.log(pool)
module.exports = pool;