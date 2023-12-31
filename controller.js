const admins = [];
let users = [];
const { response } = require('express');
const db  = require('./model');

//----------------CREATE ADMIN FUNCTION-----------------
function createAdmin(admin) {
  return new Promise(async (resolve, reject) => { 
    try {
      const credentials = `${admin.email}:${admin.password}`; // Combine username and password
      delete admin.password;
      const base64Credentials = Buffer.from(credentials, 'utf-8').toString('base64'); // Convert to base64
      admin.credential = base64Credentials;
      // admins.push(admin);
      await db.insertIntoAdmin(admin);
      console.log("Admin created Successfuly");
      resolve(admin);
    } catch (error) {
      reject(error)
    }
  })
}

//----------------CREATE USER FUNCTION--------------------------
function createUser(user) {
  return new Promise(async (resolve, reject) => {
    try {
      let newUser = { name : user.name, email: user.email, gender: user.gender };
      
      if(user.address){
        var addressTypes = user.address
      }else{
        var addressTypes = [];
      }
      
      let [homeAddress] = addressTypes.filter( address => address.type === 'HomeAddress')
      .map((address) => {
        return { 'city': address.city, 'pin': address.pin };
      });
      
      if(!homeAddress){
        homeAddress = {
        'city' : null,
        'pin' : null,
      }
    }

      let [officeAddress] = addressTypes.filter(address => address.type == 'OfficeAddress')
      .map((address) => {
        return { 'city': address.city, 'pin': address.pin };
      });
      if(!officeAddress){
        officeAddress = {
        'city' : null,
        'pin' : null,
      }
    }

      let [currentAddress] = addressTypes.filter(address => address.type == 'CurrentAddress')
      .map((address) => {
        return { 'city': address.city, 'pin': address.pin };
      });
      if(!currentAddress){
        currentAddress = {
        'city' : null,
        'pin' : null,
      }
    }

      let insertedId= await db.dbCreateUser(newUser,officeAddress,homeAddress,currentAddress);
      resolve(insertedId);
    } catch (error) {
      console.error("Error creating user:", error.message);
      reject(error);
    }
  });
}

// SHOW ALL USERS 
function getAllUsers() {
  return new Promise(async (resolve, reject) => {
    try {
      let allUsers = await db.dbGetAllUsers();
      resolve(allUsers)
    } catch (error) {
      reject(error);
    }
   })
}

// FIND USER BY USER ID
async function findUserByUserId(userId) {
  return new Promise(async (resolve, reject) => { 
    
    try {
      let user = await db.getUserById(userId);
      resolve(user);
    } catch (error) {
      reject(error);
    }
  })
  }

// FIND USER
function findUser(key, keyValue) {
  return new Promise(async (resolve, reject) => { 
    let flag = true;
    try {
      switch (key) {
        case 'Id' : key = 'ID';
          break;
        case 'email' : key = 'EMAIL'; 
          break;
        case 'name' : key = 'UNAME';
          break;
        case 'gender' : key = 'GENDER';
          break;
        case 'city' : key = 'CITY';
          flag = false; 
          break;
        case 'pin' : key = 'PIN';
          flag = false; 
          break;          
        default: reject('invalid key');
          // break;
      }
      if(flag){
        let users = await db.getUserbyKey(key,keyValue); //gte users by name , email, or gender (only look into usertable)
        resolve(users)
      }else{
        let users = await db.getUserByCityOrPincode(key,keyValue)  //gte users by city or pincode (look into addressTables by merging it with userTable)
        resolve(users)
      }

    } catch (error) {
      reject(error)
    }
   })
}

// FIND USER
// function findUserByPinCode(keyValue) {
//   keyValue = parseInt(keyValue);
//   let getUser = users.find((person) =>
//     person.address.find((addr) => {
//       if (addr.pin === keyValue) {
//         return person;
//       }
//     })
//   );
//   return getUser;
// }

// UPDATE USER
function updateUser(userId,datas) {

  return new Promise(async (resolve, reject) => { 
    try {
      let addressData;
      [...datas] = [datas];
      let [upadteKeys] = datas.map((key) => {
        return Object.keys(key)
      })
      if(datas[0].address){
        [...addressData] = [...datas[0].address]
      }
      let status = await db.dbUpdateUser(userId,datas,upadteKeys,addressData);
      if(status){
        let user = await db.getUserById(userId)
        resolve(user)
      }else{
        reject('update error')
      }
    } catch (error) {
      reject(error)
    }
   })
}

// DELETE USER
function deleteUser(userId) {
  return new Promise(async (resolve, reject) => {  
    let user = await db.getUserById(userId);
    if(user.length!=0){
      await db.deleteUser(userId)
      .then(()=>{
        resolve()
      })
      .catch(()=>{
        reject()
      })
    }else{
      reject('User not found')
    }
    
})
}

// Find a valid admin
function getAdminDetails(credential) {
  return new Promise(async (resolve, reject) => {
    try {
      const decodedCredentials = Buffer.from(credential, 'base64').toString('utf-8');
      let [username, password] = decodedCredentials.split(':');
       await db.verifyAdmin(username,credential)
       .then((response) => {
        resolve();
       }) 
       .catch((error) => {
        reject(error);
       })
    }
    catch (error) {
       reject(error);
    }
  });
}

module.exports = {
  createAdmin,
  createUser,
  getAllUsers,
  findUserByUserId,
  // findUserByPinCode,
  findUser,
  updateUser,
  deleteUser,
  getAdminDetails
};
