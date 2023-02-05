var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var user = require("../model/user.js");
var verifyToken = require("../auth/verifyToken");
var cors = require("cors");

app.options("*", cors());
app.use(cors());

var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json());
app.use(urlencodedParser);

app.post("/user/login", function (req, res) {
  var email = req.body.email;
  var password = req.body.password;

  user.loginUser(email, password, function (err, token, result) {
    if (!err) {
      // login successful
      res.status(200).json({
        success: true,
        userType: result[0].user_type,
        storeid: result[0].storeID,
        id: result[0].id,
        token: token,
        message: "You are successfully logged in!",
      });
    } else {
      // login failed
      res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
    }
  });
});

app.get("/getCategoryNames", function (req, res) {
  user.getCategoryNames(function (err, result) {
    if (err) {
      res.status(500).send(`Internal Server Error`);
    } else {
      res.status(200).send(result);
    }
  });
});

app.get("/getStoreNames", function (req, res) {
  user.getStoreNames(function (err, result) {
    if (err) {
      res.status(500).send(`Internal Server Error`);
    } else {
      res.status(200).send(result);
    }
  });
});

app.get("/getCountryNames", function (req, res) {
  user.getCountryNames(function (err, result) {
    if (err) {
      res.status(500).send(`Internal Server Error`);
    } else {
      res.status(200).send(result);
    }
  });
});

app.get("/getCityNames", function (req, res) {
  user.getCityNames(function (err, result) {
    if (err) {
      res.status(500).send(`Internal Server Error`);
    } else {
      res.status(200).send(result);
    }
  });
});

app.get("/film/details", function (req, res) {
  var title = req.query.title;
  var categoryid = req.query.categoryid;
  var maxPrice = req.query.maxPrice;

  user.search(title, categoryid, maxPrice, function (err, result) {
    if (err) {
      res.status(500).send(err.statusCode);
    } else {
      res.status(200).send(result);
    }
  });
});

app.get("/getAllDetails", function (req, res) {
  var title = req.query.title;

  user.getDetails(title, function (err, result) {
    if (err) {
      res.status(500).send(err.statusCode);
    } else {
      res.status(200).send(result);
    }
  });
});

app.post("/addActor", verifyToken, function (req, res) {
  var fName = req.body.fName;
  var lName = req.body.lName;

  user.addActor(fName, lName, function (err, result) {
    if (err) {
      res.status(500).send(err.statusCode);
    } else {
      res.status(200).send(result);
    }
  });
});

app.post("/addCustomers",  verifyToken,(req, res) => {
  const cust = ["storeid", "fName", "lName", "email", "password"];
  const add = [
    "address1",
    "address2",
    "district",
    "city",
    "postalcode",
    "phone",
  ];
  var validator = true;
  for (i = 0; i < cust.length; i++) {
    if (req.body.hasOwnProperty(cust[i])) {
      // if body has the key
      cust[i] = req.body[cust[i]]; // gets key values and puts them in array
    } else {
      validator = false; // else if the body does not have the key, itll change the validator to false
    }
  }
  if (validator) {
    // if validator is true after validating customer details
    for (i = 0; i < add.length; i++) {
      if (req.body.address.hasOwnProperty(add[i])) {
        // if body has the key
        add[i] = req.body.address[add[i]]; // gets key values and puts them in array
      } else {
        validator = false; // else if the body does not have the key, itll change the validator to false
      }
    }
  }
  if (validator) {
    //if validator is true after validating customer and address details
    user.addNewCustomer(cust, add, (err, result) => {
      if (err) {
        // if theres error, check for which error
        if (err == "EXISTS") {
          // if email exists error
          res.status(409).json([{ msg: "email already exists" }]);
        } else {
          // internal server error
          console.log(err)
          res.status(500).send(`{"error_msg": "Internal server error"}`);
        }
      } else {
        // if there's no error
        res.status(201).send(JSON.parse(`{"customer_id": "` + result + `"}`));
      }
    });
  } else {
    // if validator is false
    res.status(400).send(`{"error_msg": "missing data"}`);
  }
});

//check if film is available in store
app.get("/checkAvailability",  verifyToken, function (req, res) {
  var storeID = req.query.storeID;
  var filmID = req.query.filmID;
  user.checkAvailableFilm(filmID, storeID, function (err, result) {
    if (err) {
      res.status(500).send(`Internal Server Error`);
    } else {
      res.status(200).json(result)
    }
  });
});

//add to rental table
app.post("/rental",  verifyToken,function (req,res) {
  var rental_date = req.body.rental_date;
  var inventory_id = req.body.inventory_id
  var customer_id = req.body.customer_id
  var staff_id = req.body.staff_id
  var return_date = req.body.return_date
  console.log(rental_date, inventory_id, customer_id, staff_id, return_date)
  user.addRental(rental_date, inventory_id, customer_id, staff_id, return_date, function (err, result) {
    if (err) {
      console.log(err)
      res.status(500).send(`Internal Server Error`);
    } else {
      console.log(result)
      res.status(200).json(result)
    }
  });
})  

app.post("/payment", verifyToken,function (req,res) {
  var payment_date = req.body.payment_date;
  var rental_id = req.body.rental_id
  var customer_id = req.body.customer_id
  var staff_id = req.body.staff_id
  var amount = req.body.amount
  console.log(payment_date, rental_id, customer_id, staff_id, amount)
  user.addPayment(payment_date, rental_id, customer_id, staff_id, amount, function (err, result) {
    if (err) {
      console.log(err)
      res.status(500).send(`Internal Server Error`);
    } else {
      console.log(result)
      res.status(200).json(result)
    }
  });
})

module.exports = app;
