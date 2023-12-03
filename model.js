const { create } = require("domain");
const db = require("./connection");
const { error } = require("console");
const { json } = require("stream/consumers");
const { resolve } = require("path");
const { rejects } = require("assert");

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
        `INSERT INTO ${adminTable} (ADNAME, EMAIL, PASSKEY) VALUES ('${admin.name}','${admin.email}','${admin.credential}')`,
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
            if (result.length!= 0) {
              if (result[0].PASSKEY === credential) {
                console.log('admin verified');
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
      INSERT INTO ${userTable} ( UNAME, EMAIL, GENDER) VALUES (?, ?, ?)
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

//   get all users
dbGetAllUsers : () => {
    return new Promise((resolve, reject) => { 
        db.get().query(`SELECT * FROM ${userTable}`, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        })
     })
},

// get user by user id

getUserById : (userId) => {
  return new Promise((resolve, reject) => { 
      db.get().query(
        `
        SELECT
        u.id,
        u.uname,
        u.email,
        u.gender,
        JSON_OBJECT(
          'city', ha.city,
          'pin', ha.pin
          ) AS HomeAddress,
        JSON_OBJECT(
          'city', oa.city,
          'pin', oa.pin
          ) AS OfficeAddress,
        JSON_OBJECT(
          'city', ca.city,
          'pin', ca.pin
          ) AS CurrentAddress
    FROM
        ${userTable} u
    LEFT JOIN
        ${homeAddressTable} ha ON u.id = ha.id
    LEFT JOIN
        ${officeAddressTable} oa ON u.id = oa.id
    LEFT JOIN
        ${currentAddressTable} ca ON u.id = ca.id
    WHERE
        u.id = ${userId}
        `
        ,(error,results) => {
          if(error) {
            console.log(error);
            reject(error)
          }else{
            results.forEach(result => {
              result.HomeAddress = JSON.parse(result.HomeAddress);
              result.OfficeAddress = JSON.parse(result.OfficeAddress);
              result.CurrentAddress = JSON.parse(result.CurrentAddress);
          });
            resolve(results);
          }
      })
   })
},

// find user by key
getUserbyKey : (key,keyValue) => {
  return new Promise((resolve, reject) => { 
    console.log(key,keyValue);
    db.get().query(
      `
      SELECT * FROM ${userTable} WHERE ${key} LIKE ?
      `, [`%${keyValue}%`],
      (error,results) => {
        if(error){
          reject(error);
        }else{
          results = results.map(row => {
            return {
              ID: row.ID,
              UNAME: row.UNAME,
              EMAIL: row.EMAIL,
              GENDER: row.GENDER
            };
          });
          console.log(results);
          // results = JSON.parse(results);
          resolve(results);
        }
      }
    )
   })
},

// get user by key - CITY
getUserByCityOrPincode : (key, keyValue) => {
  return new Promise((resolve, reject) => { 
    try {
    db.get().query(
      `
      SELECT userTable.*
      FROM userTable
      JOIN homeAddressTable ON userTable.id = homeAddressTable.Id
      JOIN officeAddressTable ON userTable.id = officeAddressTable.Id
      JOIN currentAddressTable ON userTable.id = currentAddressTable.Id
      WHERE homeAddressTable.${key} LIKE ?
        OR officeAddressTable.${key} LIKE ?
        OR currentAddressTable.${key} LIKE ?
      `, [`%${keyValue}%`,`%${keyValue}%`,`%${keyValue}%`],
      (error, results) => {
        if (error) {
          console.log('----------error generated-----------/n',error);
          reject(error);
        } else {
          console.log('----------result generated-----------/n',results);
          resolve(results);
        }
      }
    )

  } catch (error) {
      reject(error);
  }


   })
},

// update User data
dbUpdateUser : (userId,datas,upadteKeys,addressData) => {
  return new Promise(async (resolve, reject) => { 
    try {
      console.log('dbUpdateUser',datas[0].email);

           db.get().query(
            `
            UPDATE ${userTable} SET EMAIL = ? WHERE ID = ?
            `, [`${datas[0].email}`,userId],
            (error, results) => {
              if (error) {
                console.log('osome errrrrrror');
                db.get().rollback();
                reject (error);
              } else {
                console.log(results);
                resolve(true);
              }
            })
            if(addressData){
              addressData.forEach( (e) => {

                db.get().query(
                  `
                  UPDATE ${e.type}Table SET city  = ?, pin = ? where id = ? 
                  `, [`${e.city}`,`${e.pin}`,userId],(error,results) => {
                    if(error){
                      console.log(error);
                      reject(error)
                    }else{
                      console.log(results);
                      resolve(true);
                    }
                  }
                  )
                }
                  )
            }else{
              console.log('undefined');
            }
      
    } catch (error) {
      reject(error);
    }
  }
)},

deleteUser: (userId) =>{
  return new Promise((resolve, reject) => { 

    db.get().query(`DELETE FROM ${homeAddressTable} WHERE Id = ?`,userId,(error,results) =>{
      if(error){
        console.log(error);
        reject(error);
      }else{
        console.log(results);

            console.log(results);
        db.get().query(`DELETE FROM ${currentAddressTable} WHERE Id = ?`,userId,(error,results) =>{
          if(error){
            reject(error);
          }else{
            console.log(results);

            console.log(results);
            db.get().query(`DELETE FROM ${officeAddressTable} WHERE Id = ?`,userId,(error,results) =>{
              if(error){
                reject(error);
              }else{
            console.log(results);

                db.get().query("DELETE FROM userTable WHERE Id = ?",userId,(error,results) =>{
                  if(error){
                    reject(error);
                  }else{
            console.log(results);

                    resolve();
                  }
                })
              }
            })
          }
        })
      }
    })
  })
    
    
  }

};
 