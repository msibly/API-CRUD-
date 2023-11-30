const admins = [];
let users = [];
let userId = 1000;
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

//CREATE USER FUNCTION
function createUser(user) {
  return new Promise((resolve, reject) => {
    try {
      let newUser = { id: userId++, name : user.name, email: user.email, gender: user.gender };

      console.log(newUser);
      
      if(user.address){
        var addressTypes = user.address
      }else{
        var addressTypes = [];
      }
      let [homeAddress] = addressTypes.filter( address => address.type === 'HomeAddress')
      .map((address) => {
        return { 'id': newUser.id, 'city': address.city, 'pin': address.pin };
      });
      console.log("homeaddress: ",homeAddress);

      const [officeAddress] = addressTypes.filter(address => address.type == 'OfficeAddress')
      .map((address) => {
        return { 'id': newUser.id, 'city': address.city, 'pin': address.pin };
      });
      console.log("officeAddress: ",officeAddress);

      const [currentAddress] = addressTypes.filter(address => address.type == 'CurrentAddress')
      .map((address) => {
        return { 'id': newUser.id, 'city': address.city, 'pin': address.pin };
      });
      console.log("currentAddress: ",currentAddress);
      
      // console.log(newUser);
      resolve(newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      reject(error);
    }
  });
}

// SHOW ALL USERS 
function getAllUsers() {
  return new Promise((resolve, reject) => {
    try {
      resolve(users)
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
