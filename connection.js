const mysql = require("mysql");

// Create a connection pool
const pool = mysql.createPool({
  connectionLimit: 10, // Set the maximum number of connections
  host: "127.0.0.1",
  port: 3306,
  user: "MM0824",
  password: "Maven@0824",
  database: 'taskOne',
  authPlugin: "mysql_native_password",
});

module.exports = {
  connectDB: (callback) => {
    // Get a connection from the pool
    pool.getConnection((err, connection) => {
      if (err) {
        console.error("error connecting: " + err.stack);
        callback(err);
        return;
      }
      console.log("DB Connected");

      // Release the connection back to the pool when done
      connection.release();
      callback(null);
    });
  },
  get: () => {
    // Return the pool for direct query execution if needed
    return pool;
  }
};
