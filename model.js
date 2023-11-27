const admins = [];
let users = [];
let userId = 1000;

//CREATE ADMIN FUNCTION
function createAdmin(admin) {
  const credentials = `${admin.email}:${admin.password}`; // Combine username and password
  delete admin.password;
  const base64Credentials = Buffer.from(credentials, 'utf-8').toString('base64'); // Convert to base64
  admin.credential = base64Credentials;
  console.log(admin);
  admins.push(admin);
  console.log("Admin created Successfuly");
}

//CREATE USER FUNCTION
function createUser(user) {
 let newUser = { id: userId++, ...user};
  users.push(newUser);
}

// SHOW ALL USERS
function getAllUsers() {
  return new Promise((resolve, reject) => {
    resolve(users)
   })
  // return users;
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
  return new Promise((resolve, reject) => {
    let getAdmin = admins.find((admin) => {
      console.log(admin.credential);
      if (admin.credential === credential) {
        return admin;
      }
    });
    resolve(getAdmin);
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