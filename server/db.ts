const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "Password@123",
  host: "localhost",
  port: 5432,
  database: "nodejs"
});

export default pool;