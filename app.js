const express = require("express");
const app = express();
const PORT = 3000;
const db = require("./connection");
const opepration = require('./model');

app.use(express.json()); // readaing the JSOn body
app.use(express.urlencoded({ extended: true }));

const {
  createAdmin,
  createUser,
  getAllUsers,
  findUserByUserId,
  findUser,
  updateUser,
  deleteUser,
  findUserByPinCode,
  getAdminDetails,
} = require("./controller");
const { request } = require("https");
const { json } = require("stream/consumers");
const { resolve } = require("path");
const { STATUS_CODES } = require("http");

// Middleware for Admin Verification
const verifyAdmin = async (req, res, next) => {
  try {
    let credential = req.headers.authorization;
    credential = credential.substring(6, credential.length);

    // Get validate admin deatils from admin database
    await getAdminDetails(credential)
    .then(()=>{
      console.log('logged --- in');
      next()
    })
    .catch((error) => {
      res.status(403).send(error)
    })
  } catch (error) {
    res.send(error);
  }
};

// SERVER STARTING FUNCTION
app.listen(PORT, () => {
  console.log(`Server Started Successfully on ${PORT}`);
});

// DB CONNECTION
db.connectDB((err) => {
  if (err){
    console.log(err);
  }else{
    console.log("DB Connected");
  }
})
// opepration.create();

// HOME ROUTE
app.get("/", (req, res) => {
  res.send("Welcome Home");
});

//ADMIN ROUTE POST
app.post("/admin", async(req, res) => {
  try {
    await createAdmin(req.body);
    res.send("admin created");
  } catch (error) {
    res.send(error);
  }
});

//USERS ROUTE -GET METHOD
app.get("/users", verifyAdmin, async (req, res) => {
  try {
    let users = await getAllUsers();
      res.send(JSON.stringify(users));
  } catch (error) {
    res.send(error);
  }

});

//CREATE USER ROUTE- POST METHOD-
app.post("/user", verifyAdmin, async (req, res) => {
  try {
    const response = await createUser(req.body);
      let userId=response.id;
      res.send("user successfully created with user with user ID "+userId);
  } catch (error) {
    res.status(400).send(error);
  }

});

// FIND USER BY PINCODE
app.get("/user/address/:pinCode", verifyAdmin, (req, res) => {
  let user = findUserByPinCode(req.params.pinCode);
  if (user) {
    res.send(JSON.stringify(user));
  } else {
    res.send("No users found");
  }
});

//USER FIND BY USER ID PARAMS ROUTE (/user/1000)
app.get("/user/:userId", verifyAdmin, (req, res) => {
  let user = findUserByUserId(parseInt(req.params.userId));
  if (user) {
    res.send(JSON.stringify(user));
  } else {
    res.send("No users found");
  }
});

// FIND USER BY QUERY - NAME/EMAIL/CITY
app.get("/user?", verifyAdmin, (req, res) => {
  const queryParameters = req.query;
  const [key] = Object.keys(queryParameters); // Assuming there's only one key-value pair in the query parameters
  const keyValue = queryParameters[key];
  let user = findUser(key, keyValue);
  if (user) {
    res.send(JSON.stringify(user));
  } else {
    res.send("No users found");
  }
});

// UPDATE USER
app.put("/user/:userId", verifyAdmin, (req, res) => {
  let data = req.body;
  let user = updateUser(req.params.userId, data);
  if (user) {
    res.send(JSON.stringify(user));
  } else {
    res.send("No users found");
  }
});

//USER DELETE ROUTE (/user/?query=queryValue)
app.delete("/user/:userId", verifyAdmin, async (req, res) => {
  await deleteUser(req.params.userId)
    .then(() => {
      res.send("user deleted");
    })
    .catch((err) => {
      res.send(err);
    });
});

// 404 ERROR
app.get("*", (req, res) => {
  res.send("404 Error");
});
