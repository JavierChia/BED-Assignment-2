var db = require('./databaseConfig'); //imports dbconnect
var config = require('../config') //imports secretkey
var jwt = require('jsonwebtoken'); //imports jsonwebtoken - can use to generate web token

var userDB = {
    loginUser: function (email, password, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err)
                return callback(err, null);
            } else {
                console.log('connected, beginning login now');
                var loginUser = `SELECT * FROM (
                    SELECT 'staff' AS user_type, store_id as storeID, staff_id as id FROM staff WHERE email = ? AND password = ?
                    UNION
                    SELECT 'customer' AS user_type, store_id as storeID, customer_id as id FROM customer WHERE email = ? AND password = ?
                  ) t`

                conn.query(loginUser, [email, password, email, password], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log("err: " + err)
                        return callback(err, null, null)
                    }
                    else {
                        var token = ""
                        if (result.length == 1) { //means user is found
                            token = jwt.sign({ id: result[0].id }, config.key, {
                                expiresIn: 86400 //expires in 30mins
                            })
                            return callback(null, token, result)
                        } else {
                            var err2 = new Error('Email/Password does not match');
                            err2.statusCode = 500;
                            return callback(err2, null, null)
                        }

                    }
                })
            }
        })
    },

    getCategoryNames: function (callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                return callback(err, null)
            } else {
                var sql = `select name from category`
                conn.query(sql, function (err, result) {
                    conn.end();
                    if (err) {
                        return callback(err, null)
                    } else {
                        return callback(null, result)
                    }
                })
            }
        })
    },

    getStoreNames: function (callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                return callback(err, null)
            } else {
                var sql = `SELECT address from address a join store s on a.address_id = s.address_id`
                conn.query(sql, function (err, result) {
                    conn.end();
                    if (err) {
                        return callback(err, null)
                    } else {
                        return callback(null, result)
                    }
                })
            }
        })
    },

    getCountryNames: function (callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                return callback(err, null)
            } else {
                var sql = `SELECT country from country`
                conn.query(sql, function (err, result) {
                    conn.end();
                    if (err) {
                        return callback(err, null)
                    } else {
                        return callback(null, result)
                    }
                })
            }
        })
    },

    getCityNames: function (callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                return callback(err, null)
            } else {
                var sql = `SELECT city from city`
                conn.query(sql, function (err, result) {
                    conn.end();
                    if (err) {
                        return callback(err, null)
                    } else {
                        return callback(null, result)
                    }
                })
            }
        })
    },


    search: function (title, categoryid, maxPrice, callback) {
        var conn = db.getConnection();
        console.log(categoryid == 'NaN')
        conn.connect(function (err) {
            if (err) {
                return callback(err)
            } else {
                let sql = `select f.film_id as id, f.img, f.title, f.release_year, f.rating, f.rental_rate, f.rental_duration as duration from film f`;
                let values = [];
                if (categoryid != 'NaN' && !title) {
                    sql += ` join film_category fg on f.film_id = fg.film_id where fg.category_id = ?`
                    values.push(categoryid);
                } else if (categoryid != 'NaN' && title) {
                    sql += ` join film_category fg on f.film_id = fg.film_id where fg.category_id = ? and title like ?`;
                    values.push(categoryid, `%${title}%`);
                } else if (categoryid == 'NaN' && title) {
                    sql += ` where title like ?`;
                    values.push(`%${title}%`);
                }

                if (maxPrice) {
                    sql += ` and f.rental_rate <= ?`;
                    values.push(maxPrice);
                }

                console.log(sql)
                conn.query(sql, values, function (err, result) {
                    conn.end();
                    if (err) {
                        return callback(err, null);
                    } else {
                        console.log(result)
                        return callback(null, result);
                    }
                });
            }
        })
    },

    getDetails: function (title, callback) {
        var conn = db.getConnection()
        conn.connect(function (err) {
            if (err) {
                return callback(err, null)
            } else {
                var sql =
                    `SELECT f.img, l.name as language, f.title, f.film_id as id, f.release_year, f.rental_duration as duration, f.length, f.special_features, f.rental_rate, f.description, f.rating, c.name as category, subquery.all_actors 
                FROM film f
                JOIN film_category fc ON f.film_id = fc.film_id
                JOIN category c ON fc.category_id = c.category_id
                join language l on f.language_id = l.language_id
                JOIN (
                    SELECT group_concat(concat(a.first_name, ' ', a.last_name) SEPARATOR ' • ') as all_actors, fa.film_id
                    FROM actor a 
                    JOIN film_actor fa ON a.actor_id = fa.actor_id 
                    JOIN film f ON f.film_id = fa.film_id 
                    WHERE f.title = ?
                    GROUP BY fa.film_id
                ) subquery ON subquery.film_id = f.film_id
                WHERE title = ?`
                conn.query(sql, [title, title], function (err, result) {
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    } else {
                        console.log(result)
                        return callback(null, result)
                    }
                })

            }
        })
    },

    addActor: function(fName, lName, callback) {
        var conn = db.getConnection()
        conn.connect(function(err) {
            if(err) {
                return callback(err, null)
            } else {
                var sql = `insert into actor(first_name, last_name) values(?, ?);`
                conn.query(sql, [fName, lName], function(err, result) {
                    if(err) {
                        return callback(err, null);
                    } else {
                        return callback(null, result)
                    }
                })
            }
        })
    },

    // Endpoint 8
    addNewCustomer: function (cust, add, callback) {
        const checkEmail = `SELECT * FROM customer WHERE email = ?`;  // sql query to check for duplicate email
        const addAdd = `INSERT INTO address (address, address2, district, city_id, postal_code, phone) VALUES (?, ?, ?, ?, ?, ?)`; // sql query for adding address
        const addCus = `INSERT INTO customer (store_id, first_name, last_name, email, password, address_id) VALUES (?, ?, ?, ?, ?, ?);`; // sql query for adding customer
        var conn = db.getConnection();
        conn.connect((err) => { // callback function to handle results from connection
            if (err) { // if error in connection
                return callback(err, null);
            } else { // connection successful
                conn.query(checkEmail, [cust[3]], (err, result) => { // run sql query to check for duplicate email
                    if (err) { // if error in checking for duplicate email
                        return callback(err, null);
                    } else if (result.length == 0) { // if result is empty (which means email is not duplicate email)
                        conn.query(addAdd, [add[0], add[1], add[2], add[3], add[4], add[5]], (err, addressResult) => { // run sql query to add address
                            if (err) { // if error in adding address
                                return callback(err, null);
                            } else { // if no error, add customer
                                conn.query(addCus, [cust[0], cust[1], cust[2], cust[3], cust[4], addressResult.insertId], (err, CustomerResult) => { // run sql query to add customer
                                    if (err) { //if erro in adding customer
                                        return callback(err, null);
                                    } else { //if no error, return customerID
                                        return callback(null, CustomerResult.insertId);
                                    }
                                })
                            }
                        })
                    } else { // else if result is not empty (which means email is duplicate email)
                        return callback('EXISTS', null)
                    }
                });
            }
        })
    },

    //rent films

    //Check if film is available
    checkAvailableFilm: function( filmID, storeID, callback){
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                return callback(err, null)
            } else {
                var sql = `SELECT inventory_id from inventory where film_id = ? and store_id = ? limit 1`
                conn.query(sql,  [filmID, storeID], function (err, result) {
                    conn.end();
                    if (err) {
                        return callback(err, null)
                    } else {
                        if (result.length > 0) {
                            var newResult = result[0].inventory_id
                            return callback(null, newResult)
                        } else {
                            return callback(null, result)
                        }
                    }
                })
            }
        })
    },

    addRental: function (rental_date, inventory_id, customer_id, staff_id, return_date, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                return callback(err, null)
            } else {
                var sql = `INSERT into rental(rental_date, inventory_id, customer_id, return_date, staff_id) VALUES (?, ?, ?, ?, ?)`
                conn.query(sql,  [rental_date, inventory_id, customer_id, return_date, staff_id], function (err, result) {
                    conn.end();
                    if (err) {
                        return callback(err, null)
                    } else {
                        return callback(null, result.insertId)
                    }
                })
            }
        })
    },

    addPayment: function (payment_date, rental_id, customer_id, staff_id, amount, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                return callback(err, null)
            } else {
                var sql = `INSERT into payment(payment_date, rental_id, customer_id, staff_id, amount) VALUES (?, ?, ?, ?, ?)`
                conn.query(sql,  [payment_date, rental_id, customer_id, staff_id, amount], function (err, result) {
                    conn.end();
                    if (err) {
                        return callback(err, null)
                    } else {
                        return callback(null, result)
                    }
                })
            }
        })
    }



}

module.exports = userDB;