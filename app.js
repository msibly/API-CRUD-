const express = require("express");
const app = express();
const PORT = 3000;

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
} = require("./model");
const { request } = require("https");
const { json } = require("stream/consumers");

// Middleware for Admin Verification
const verifyAdmin = async (req, res, next) => {
  try {
    let credential = req.headers.authorization;
    credential = credential.substring(6, credential.length);

    // Get validate admin deatils from admin database
    let getAdmin = await getAdminDetails(credential);

    if (getAdmin) {
      next();
    } else {
      res.status(401).send("Unauthorized: Check Username or Password.");
    }
  } catch (error) {
    res.status(error.statusCode).send;
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
    await createUser(req.body);
    res.send("user successfully created with user with user ID ");
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
