const mysql = require("mysql");
const config = require("./config");

// Create a connection pool
const pool = mysql.createPool({
  connectionLimit: 10, // Set the maximum number of connections
  host: config.host,
  port: config.port,
  user: config.uname,
  password: config.password,
  database: config.database,
  authPlugin: config.authType,
});

module.exports = {
  connectDB: (callback) => {
    // Get a connection from the pool
    pool.getConnection((err, connection) => {
      if (err) {
        callback(err);
        return;
      } else {
        console.log("connection establishment Success-");
        createTables(connection, callback);
        // Release the connection back to the pool when done
        connection.release();
      }
    });
  },
  get: () => {
    // Return the pool for direct query execution if needed
    return pool;
  },
};

function createTables(connection, callback) {
  // admin table
  connection.query(
    `
      CREATE TABLE IF NOT EXISTS adminTable 
        ( 
          ID INT PRIMARY KEY AUTO_INCREMENT,
          NAME VARCHAR(255),
          EMAIL VARCHAR(255) UNIQUE, 
          PASSKEY VARCHAR(255)
        ) AUTO_INCREMENT=1
      `,
    (error) => {
      if (error) {
        console.log(error);
        callback(error);
      } else {
        console.log(`adminTable created successfully`);

        // user table
        connection.query(
          `CREATE TABLE IF NOT EXISTS userTable (
           ID INT PRIMARY KEY AUTO_INCREMENT ,
           NAME VARCHAR(255),
           EMAIL VARCHAR(255) UNIQUE,
           GENDER VARCHAR(255)
           )
            AUTO_INCREMENT=1000;
         `,
          (error) => {
            if (error) {
              console.log(error);
              callback(error);
            } else {
              console.log(`userTable created successfully`);

              // Office address
              connection.query(
                `CREATE TABLE IF NOT EXISTS officeAddressTable(
                ID INT PRIMARY KEY AUTO_INCREMENT,
                CITY VARCHAR(255),
                PIN INT,
                FOREIGN KEY(ID) REFERENCES userTable(ID)
              )
              AUTO_INCREMENT=1000
              `,
                (error) => {
                  if (error) {
                    console.log(error);
                    callback(error);
                  } else {
                    console.log(`officeAddressTable created successfully`);

                    // home address table
                    connection.query(
                      `CREATE TABLE IF NOT EXISTS homeAddressTable(
                        ID INT PRIMARY KEY AUTO_INCREMENT,
                        CITY VARCHAR(255),
                        PIN INT,
                        FOREIGN KEY(ID) REFERENCES userTable(ID)
                    )
                    AUTO_INCREMENT=1000
                    `,
                      (error) => {
                        if (error) {
                          console.log(error);
                          callback(error);
                        } else {
                          console.log(
                            `homeAddressTable created successfully`
                          );

                          // home address table
                          connection.query(
                            `CREATE TABLE IF NOT EXISTS currentAddressTable(
                              ID INT PRIMARY KEY AUTO_INCREMENT,
                              CITY VARCHAR(255),
                              PIN INT,
                              FOREIGN KEY(ID) REFERENCES userTable(ID)
                          )
                          AUTO_INCREMENT=1000
                          `,
                            (error) => {
                              if (error) {
                                console.log(error);
                                callback(error);
                              } else {
                                console.log(
                                  `current Address created successfully`
                                );

                                callback(null);
                              }
                            }
                          );
                          // callback(null);
                        }
                      }
                    );
                    // callback(null);
                  }
                }
              );
              // callback(null);
            }
          }
        );
        // callback(null);
      }
    }
  );
}
