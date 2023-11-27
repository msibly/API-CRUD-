const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());  // readaing the JSOn body
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
} = require("./model");
const { request } = require("https");
const { json } = require("stream/consumers");

// Middleware for Admin Verification
const verifyAdmin = async (req, res, next) => {

  let credential = req.headers.authorization
  console.log(typeof(credential))
  credential = credential.substring(6,credential.length)

  // Get validate admin deatils from admin database
  let getAdmin = await getAdminDetails(credential);
  console.log('returned promise',getAdmin);

  if(getAdmin){
    next();
  }else{
    res.status(401).send("Unauthorized: Check Username or Password.");
  }
};

app.listen(PORT, () => {
  console.log(`Server Started Successfully on ${PORT}`);
});

// HOME ROUTE
app.get("/", (req, res) => {
  res.send("Welcome Home");
});

//ADMIN ROUTE POST
app.post("/admin", (req, res) => {
  createAdmin(req.body);
  res.send("admin created");
});

//USERS ROUTE -GET METHOD
app.get("/users", verifyAdmin, async (req, res) => {
  let users = await getAllUsers();
  if(users.length > 0){
    res.send(JSON.stringify(users));
  }else{
    res.send("No users found");
  }
});

//CREATE USER ROUTE- POST METHOD-
app.post("/user", verifyAdmin, (req, res) => {
  createUser(req.body);
  res.send("user successfully created with user with user ID ");
});

// FIND USER BY PINCODE
app.get("/user/address/:pinCode", verifyAdmin, (req, res) => {
  console.log(req.params.pinCode);
  let user = findUserByPinCode(req.params.pinCode);
  if(user){
    res.send(JSON.stringify(user));
  }else{
    res.send("No users found");
  }
});

//USER FIND BY USER ID PARAMS ROUTE (/user/1000)
app.get("/user/:userId", verifyAdmin, (req, res) => {
  let user = findUserByUserId(parseInt(req.params.userId));
  if(user){
    res.send(JSON.stringify(user));
  }else{
    res.send("No users found");
  }
});

// FIND USER BY QUERY - NAME/EMAIL/CITY
app.get("/user?", verifyAdmin, (req, res) => {
  const queryParameters = req.query;
  const [key] = Object.keys(queryParameters); // Assuming there's only one key-value pair in the query parameters
  const keyValue = queryParameters[key];
  let user = findUser(key, keyValue);
  if(user){
    res.send(JSON.stringify(user));
  }else{
    res.send("No users found");
  }
});

// UPDATE USER
app.put("/user/:userId", verifyAdmin, (req, res) => {
  let data = req.body;
  console.log(data);
  let user = updateUser(req.params.userId, data);
  if(user){
    res.send(JSON.stringify(user));
  }else{
    res.send("No users found");
  }
});

//USER DELETE ROUTE (/user/?query=queryValue)
app.delete("/user/:userId", verifyAdmin, async (req, res) => {
 await deleteUser(req.params.userId).then(()=>{
    res.send("user deleted");
  })
  .catch((err)=>{
      res.send(err);
    })
});

// 404 ERROR
app.get("*", (req, res) => {
  res.send("404 Error");
});
