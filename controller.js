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
        'city' : '',
        'pin' : ''
      }
    }

      let [officeAddress] = addressTypes.filter(address => address.type == 'OfficeAddress')
      .map((address) => {
        return { 'city': address.city, 'pin': address.pin };
      });
      if(!officeAddress){
        officeAddress = {
        'city' : '',
        'pin' : ''
      }
    }

      let [currentAddress] = addressTypes.filter(address => address.type == 'CurrentAddress')
      .map((address) => {
        return { 'city': address.city, 'pin': address.pin };
      });
      if(!currentAddress){
        currentAddress = {
        'city' : '',
        'pin' : ''
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
function findUserByUserId(keyValue) {
  let getUser = users.find((user) => {
    return user.id === keyValue;
  });
  return getUser;
}

// FIND USER
function findUser(key, keyValue) {
  let getUser = users.find((person) =>
    person[key].toLowerCase().includes(keyValue.toLowerCase())
  );
  return getUser;
}

// FIND USER
function findUserByPinCode(keyValue) {
  keyValue = parseInt(keyValue);
  let getUser = users.find((person) =>
    person.address.find((addr) => {
      if (addr.pin === keyValue) {
        return person;
      }
    })
  );
  return getUser;
}

// UPDATE USER
function updateUser(userId, userDetails) {
  userId = parseInt(userId);
  users = users.map((element) => {
    if (element.id === userId) {
      return { ...element, ...userDetails };
    } else {
      return { ...element };
    }
  });
  let updatedUser = users.find((person) => {
    if (person.id === userId) {
      return person;
    }
  });
  return updatedUser;
}

// DELETE USER
function deleteUser(userId) {
  return new Promise((resolve, reject) => {  
  userId = parseInt(userId);
  let indexToRemove = -1;

  for (let i = 0; i < users.length; i++) {
    if (users[i].id === userId) {
      indexToRemove = i;
      break;
    }
  }

  if (indexToRemove !== -1) {
    users.splice(indexToRemove, 1);
    console.log("User deleted successfully");
    resolve();
  } else {
    console.log("User not found");
    reject("User not found");
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
  findUserByPinCode,
  findUser,
  updateUser,
  deleteUser,
  getAdminDetails
};
