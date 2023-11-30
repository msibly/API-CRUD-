const { create } = require("domain");
const db = require("./connection");
const { error } = require("console");

const userTable = "userTable";
const adminTable = "adminTable";
const officeAddressTable = "officeAddressTable";
const homeAddressTable = "homeAddressTable";
const currentAddressTable = "currentAddressTable";

//insert into  admin table

module.exports = {
  // insert into adminTable
  insertIntoAdmin: (admin) => {
    return new Promise((resolve, reject) => {
      db.get().query(
        `INSERT INTO ${adminTable} (NAME, EMAIL, PASSKEY) VALUES ('${admin.name}','${admin.email}','${admin.credential}')`,
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });
  },

  // verify admin details
  verifyAdmin: (email, credential) => {
    return new Promise((resolve, reject) => {
      db.get().query(
        `SELECT * FROM ${adminTable} WHERE EMAIL = '${email}'`,
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            if (result.length > 0) {
              if (result[0].passKEY === credential) {
                resolve();
              } else {
                reject("password missmatch");
              }
            } else {
              reject("email missmatch");
            }
          }
        }
      );
    });
  },

  // Create user
  dbCreateUser: (user, officeAddress, homeAddress, currentAddress) => {
    console.log(officeAddress, "\n", homeAddress, "\n", currentAddress);
    return new Promise((resolve, reject) => {
      db.get().query(
        `
      INSERT INTO ${userTable} ( NAME, EMAIL, GENDER) VALUES (?, ?, ?)
      `,
        [user.name, user.email, user.gender],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            console.log(results);
            let userId = results.insertId;
            db.get().query(
              `
            INSERT INTO ${officeAddressTable} ( ID, CITY, PIN) VALUES (?, ?, ?)
            `,
              [userId, officeAddress.city, officeAddress.pin],
              (error, results) => {
                if (error) {
                  reject(error);
                } else {
                  console.log(results);
                  db.get().query(
                    `
                  INSERT INTO ${homeAddressTable} ( ID, CITY, PIN) VALUES (?, ?, ?)
                  `,
                    [userId, homeAddress.city, homeAddress.pin],
                    (error, results) => {
                      if (error) {
                        reject(error);
                      } else {
                        console.log(results);
                        db.get().query(
                          `
                        INSERT INTO ${currentAddressTable} ( ID, CITY, PIN) VALUES (?, ?, ?)
                        `,
                          [userId, currentAddress.city, currentAddress.pin],
                          (error, results) => {
                            if (error) {
                              reject(error);
                            } else {
                              console.log(results);
                              resolve(userId);
                            }
                          }
                        );
                      }
                    }
                  );
                }
              }
            );
          }
        }
      );
    });
  },
};
 