const { create } = require("domain");
const db = require("./connection");
const { error } = require("console");

const userTable = 'userTable';
const adminTable = 'adminTable';
const officeAddressTable = 'officeAddressTable';
const homeAddressTable = 'homeAddressTable';
const currentAddressTable = 'currentAddressTable';


// USER TABLE CREATION
(() => {
    db.get().query(
        `CREATE TABLE IF NOT EXISTS ${userTable} (
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
        }else{
            console.log(`${userTable} created successfully`);
        }
      }
    );
  })();

//   OFFICE ADDRESS TABLE CREATION
  (() => {
    db.get().query(
        `CREATE TABLE IF NOT EXISTS ${officeAddressTable}(
            ID INT PRIMARY KEY AUTO_INCREMENT,
            CITY VARCHAR(255),
            PIN INT,
            FOREIGN KEY(ID) REFERENCES ${userTable}(ID)
        )
        AUTO_INCREMENT=1000
        `, (e) => {
            if (e) {
              console.log(e);
            } else {
              console.log(`${officeAddressTable} created successfully`);
            }
        }
    )
  })();

//   HOME ADDRESS CREATION
(() => {
    db.get().query(
        `CREATE TABLE IF NOT EXISTS ${homeAddressTable}(
            ID INT PRIMARY KEY AUTO_INCREMENT,
            CITY VARCHAR(255),
            PIN INT,
            FOREIGN KEY(ID) REFERENCES ${userTable}(ID)
        )
        AUTO_INCREMENT=1000
        `, (e) => {
            if (e) {
              console.log(e);
            } else {
              console.log(`${homeAddressTable} created successfully`);
            }
        }
    )
  })();

//   CURRENT ADDRESS TABLE CREATION
  (() => {
    db.get().query(
        `CREATE TABLE IF NOT EXISTS ${currentAddressTable}(
            ID INT PRIMARY KEY AUTO_INCREMENT,
            CITY VARCHAR(255),
            PIN INT,
            FOREIGN KEY(ID) REFERENCES ${userTable}(ID)
        )
        AUTO_INCREMENT=1000
        `, (e) => {
            if (e) {
              console.log(e);
            } else {
              console.log(`${currentAddressTable} created successfully`);
            }
        }
    )
  })();

// ADMIN TABLE CREATION
(()=> {
    
})();
module.exports = {
  
  
};
