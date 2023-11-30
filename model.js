const { create } = require("domain");
const db = require("./connection");
const { error } = require("console");

const userTable = 'userTable';
const adminTable = 'adminTable';
const officeAddressTable = 'officeAddressTable';
const homeAddressTable = 'homeAddressTable';
const currentAddressTable = 'currentAddressTable';

//insert into  admin table

module.exports = {

    // insert into adminTable
    insertIntoAdmin : (admin) => {
        return new Promise((resolve, reject) => {
            db.get().query(`INSERT INTO ${adminTable} (NAME, EMAIL, PASSKEY) VALUES ('${admin.name}','${admin.email}','${admin.credential}')`, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            })
        })
    },

    // verify admin details
    verifyAdmin : (email,credential) => {
        return new Promise((resolve, reject) => {
            db.get().query(`SELECT * FROM ${adminTable} WHERE EMAIL = '${email}'`, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    if(result.length > 0) {
                        if(result[0].passKEY === credential){
                            resolve()
                        }else{
                            reject('password missmatch')
                        }
                    }else{
                        reject('email missmatch');
                    }
                }
            })
        })
    },

    // Create user
    createUser : (user) => {
        return new Promise((resolve, reject) => { 
            
         })
    }
}