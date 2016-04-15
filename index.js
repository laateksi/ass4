// Author: Lauri "Super" Tyyskä & Jimi "Jalmari" Manninen

var express = require('express'),
    app = express();
var bodyParser = require("body-parser");
var uuid = require('node-uuid');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql',
    database: 'warehouse_db'
});
//instructions for the user - will be shown in the /warehouse view
var instructions = {
    Searching_Materials: "You can search materials with parameters: 'id, category, type, quantity, supplier, arrival_date, receivedBefore, receivedAfter.",
    Searching_Products: "You can search products with parameters: 'id, category, type, quantity, customer, arrival_date, receivedBefore, receivedAfter.",
    Deleting: "You can delete existing materials or products with the specific id.",
    Updating: "You can update existing material or product information with the specific id. Fill in the material_id or product_id with key: 'id' and value for the id. Then you can assign update one of the fields (category, type, quantity, supplier, customer, arrival_date and the key 'assign' for assigning materials) for that material/prduct.",
    Adding: "You can add materials or products by filling the parameters for category, type, quantity, supplier(for material), customer(for product) and arrival_date. The id for material/product will be generated automatically.",
    Other: "Using other parameters than described above will result in error. with other error situations, you will be will be given additional information. You are able to navigate in the postman via links /warehouse, /warehouse/materials, /warehouse/products."
};
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Body parser use JSON data

//create a connection to mySQL
connection.connect(function (err) {             
    if (!err) {
        console.log("Connected to database.");
    } else {
        res.statusCode = 503; //Service unavailable
        console.log("Error...");
        console.log(err);
        process.exit(1);
    }
});


//----GET---------------------------------------------------------------------------
//----Get warehouse-----------------------------------------------------------------
app.get('/warehouse', function (req, res) {
    var warehouseView = {
        //links to materials and products
        materials: "/warehouse/materials",
        products: "/warehouse/products",
        instructions: instructions
    };
    res.send(warehouseView);
});

//--get materials
app.get('/warehouse/materials', function (req, res) {
    
    var data = {
        "Back to Warehouse": "/warehouse",
        "Go to Materials": "/warehouse/materials",
        "Go to Products": "/warehouse/products",
        "Materials": ""
    };
    var query = req.query;
    //get all the params 
    var id = query.id;
    var category = query.category;
    var type = query.type;
    var quantity = query.quantity;
    var supplier = query.supplier;
    var date = query.arrival_date;
    var receivedBefore = query.receivedBefore;
    var receivedAfter = query.receivedAfter;
    var check = 0;

    //Start creating the sql query - Query is compiled according to the users given parameters
    var sql_query = "SELECT * FROM materials WHERE "; // Beginning of the quary...
    //The if statements are used to determine what parameters user has used. If query.hasOwnProperty=True, user has
    //inserted parameter for that property and corresponding mySQL property is added to sql_query. If query.hasOwnProperty = False, we skip this if-statement and move
    //to the next if-statement 
    if (query.hasOwnProperty('id')) {
        sql_query = sql_query + "material_id='" + id + "'";
        check = 1;
        //check sum is used to keep track if anything has been added to sql_query
    }
    //if check sum is 1, an earlier parameter has been added to sql_query and we have to include next parameters
    //to sql_query with "AND" so the sql syntax is valid. 
    if (query.hasOwnProperty('category')) {
        if (check != 0) {
            
            sql_query = sql_query + "AND category='" + category + "'";
        } else {
            sql_query = sql_query + "category='" + category + "'";
            check = 1;
        }
    }
    if (query.hasOwnProperty('type')) {
        if (check != 0) {
            sql_query = sql_query + "AND type='" + type + "'";
        } else {
            sql_query = sql_query + "type='" + type + "'";
            check = 1;
        }
    }
    if (query.hasOwnProperty('quantity')) {
        if (check != 0) {
            sql_query = sql_query + "AND quantity='" + quantity + "'";
        } else {
            sql_query = sql_query + "quantity='" + quantity + "'";
            check = 1;
        }
    }
    if (query.hasOwnProperty('supplier')) {
        if (check != 0) {
            sql_query = sql_query + "AND supplier='" + supplier + "'";
        } else {
            sql_query = sql_query + "supplier='" + type + "'";
            check = 1;
        }
    }
    //materials for exact arrival_date
    if (query.hasOwnProperty('arrival_date')) {
        if (check != 0) {
            sql_query = sql_query + "AND arrival_date='" + date + "'";
        } else {
            sql_query = sql_query + "arrival_date='" + date + "'";
            check = 1;
        }
    }
    //next two if-statesments are for sorting materials according to the date
    if (query.hasOwnProperty('receivedBefore')) {
        if (check != 0) {
            sql_query = sql_query + "AND arrival_date<='" + receivedBefore + "'";
        } else {
            sql_query = sql_query + "arrival_date<='" + receivedBefore + "'";
            check = 1;
        }
    }
    if (query.hasOwnProperty('receivedAfter')) {
        if (check != 0) {
            sql_query = sql_query + "AND arrival_date>='" + receivedAfter + "'";
        } else {
            sql_query = sql_query + "arrival_date>='" + receivedAfter + "'";
            check = 1;
        }
    }
    //if user did not use any of the sorting parameters described above, we will GET all the info. Other than these parameters will also result in GET all info. 
    if (check == 0) {
        sql_query = "SELECT * from materials";
    }

    //connection to mysql and final query statement + result handling
    connection.query(sql_query, function (err, rows, fields) {
        if (rows.length != 0) {
            data["Materials"] = rows;
            res.status(200).json(data);
        } else {
            data["Materials"] = 'No Materials found..';
            res.status(404).json(data);
        }
    })

});
//This is GET for products - it is built the same way as GET for materials above
app.get('/warehouse/products', function (req, res) {
    var data = {
        "Back to Warehouse": "/warehouse",
        "Go to Materials": "/warehouse/materials",
        "Go to Products": "/warehouse/products",
        "Products": ""
    };
    var query = req.query;

    var id = query.id;
    var category = query.category;
    var type = query.type;
    var quantity = query.quantity;
    var customer = query.customer;
    var date = query.arrival_date;
    var receivedBefore = query.receivedBefore;
    var receivedAfter = query.receivedAfter;
    var check = 0;

    var sql_query = "SELECT * FROM products WHERE ";
    if (query.hasOwnProperty('id')) {
        sql_query = sql_query+"product_id='" + id + "'";
        check = 1;
    }
    if (query.hasOwnProperty('category')) {
        if (check != 0) {
            sql_query = sql_query + "AND category='" + category + "'";
        } else {
            sql_query = sql_query + "category='" + category + "'";
            check = 1;
        } 
    }
    if (query.hasOwnProperty('type')) {
        if (check != 0) {
            sql_query = sql_query + "AND type='" + type + "'";
        } else {
            sql_query = sql_query + "type='" + type + "'";
            check = 1;
        }
    }
    if (query.hasOwnProperty('quantity')) {
        if (check != 0) {
            sql_query = sql_query + "AND quantity='" + quantity + "'";
        } else {
            sql_query = sql_query + "quantity='" + quantity + "'";
            check = 1;
        }
    }
    if (query.hasOwnProperty('customer')) {
        if (check != 0) {
            sql_query = sql_query + "AND customer='" + customer + "'";
        } else {
            sql_query = sql_query + "customer='" + type + "'";
            check = 1;
        }
    }
    //materials for exact arrival_date
    if (query.hasOwnProperty('arrival_date')) {
        if (check != 0) {
            sql_query = sql_query + "AND arrival_date='" + date + "'";
        } else {
            sql_query = sql_query + "arrival_date='" + date + "'";
            check = 1;
        }
    }
    //next two if-statesments are for sorting materials according to the date
    if (query.hasOwnProperty('receivedBefore')) {
        if (check != 0) {
            sql_query = sql_query + "AND arrival_date<='" + receivedBefore + "'";
        } else {
            sql_query = sql_query + "arrival_date<='" + receivedBefore + "'";
            check = 1;
        }
    }
    if (query.hasOwnProperty('receivedAfter')) {
        if (check != 0) {
            sql_query = sql_query + "AND arrival_date>='" + receivedAfter + "'";
        } else {
            sql_query = sql_query + "arrival_date>='" + receivedAfter + "'";
            check = 1;
        }
    }
    if (check == 0) {
        sql_query = "SELECT * from products";
    }
    
    //connection to mysql and final query statement + result handling
    connection.query(sql_query, function (err, rows, fields) {
        if (rows.length != 0) {
            data["Products"] = rows;
            res.status(200).json(data);
        } else {
            data["Products"] = 'No products found..';
            res.status(404).json(data);
        }
    })

});
//--------------------------------------------------------GET----------------
//-POST/ADD----------------------------------------------------------------------
//--Materials

app.post('/warehouse/materials', function (req, res) {
    var data = {
        "Back to Warehouse": "/warehouse",
        "Go to Materials": "/warehouse/materials",
        "Go to Products": "/warehouse/products",
        "Message": ""
    };

    var query = req.query;

    //Test all attributes are given (id, category, type, quantity, supplier, arrival_date)
    if (query.hasOwnProperty('category') && query.hasOwnProperty('type')
        && query.hasOwnProperty('quantity') && query.hasOwnProperty('supplier') && query.hasOwnProperty('arrival_date')) {
        // Test that attributes are not empty
        if (query.category.length != 0 && query.type.length != 0
            && query.quantity.length != 0 && query.supplier.length != 0 && query.arrival_date.length != 0) {

            // Create an id and GET the attributes and store them into variables
            var id = uuid.v4() // id generated
            var category = query.category;
            var type = query.type;
            var quantity = query.quantity;
            var supplier = query.supplier;
            var date = query.arrival_date;

            // conenction to mysql database + inserting data to database according to given parameters + result handling
            connection.query("INSERT INTO materials (material_id,category,type,quantity,supplier,arrival_date) VALUES ('" + id + "','" + category + "','" + type + "','" + quantity + "','" + supplier + "','" + date + "')", function (err, rows, fields) {
                if (err) {
                    console.log("Error Adding data: " + err);
                    data["Message"] = "Error Adding data";
                    //respond to postman
                    res.status(400).json(data); //400 Query not complete
                } else {

                    console.log("Material Created Successfully");
                    data["Message"] = "Material Created Successfully";
                    //respond to postman
                    res.status(201).json(data); //201: Created
                }
            });

        } else {
            console.log("Empty attributes!")
            data["Message"] = "Bad request: Empty attributes!";
            res.status(400).json(data); //Bad request
        }
    } else {
        console.log("You must fill category, type, quantity, supplier and arrival_date");
        data["Message"] = "You must fill category, type, quantity, supplier and arrival_date";
        res.status(400).json(data);
    };
});

//-Products----------------------------------------------
app.post('/warehouse/products', function (req, res) {
    var data = {
        "Back to Warehouse": "/warehouse",
        "Go to Materials": "/warehouse/materials",
        "Go to Products": "/warehouse/products",
        "Message": ""
    };
    var query = req.query;

    //Test all attributes are given (id, category, type, quantity, supplier, arrival_date)
    if (query.hasOwnProperty('category') && query.hasOwnProperty('type')
        && query.hasOwnProperty('quantity') && query.hasOwnProperty('customer') && query.hasOwnProperty('arrival_date')) {
        // Test that attributes are not empty
        if (query.category.length != 0 && query.type.length != 0
            && query.quantity.length != 0 && query.customer.length != 0 && query.arrival_date.length != 0) {

            var id = uuid.v4() //id generated
            var category = query.category;
            var type = query.type;
            var quantity = query.quantity;
            var customer = query.customer;
            var date = query.arrival_date;

            // conenction to mysql database + inserting data to database according to given parameters + result handling
            connection.query("INSERT INTO products (product_id,category,type,quantity,customer,arrival_date) VALUES ('" + id + "','" + category + "','" + type + "','" + quantity + "','" + customer + "','" + date + "')", function (err, rows, fields) {
                if (err) {
                    console.log("Error Adding data");
                    data["Message"] = "Error Adding data";
                    res.status(400).json(data);
                } else {

                    console.log("Product Added Successfully");
                    data["Message"] = "Product Added Successfully";
                    res.status(201).json(data);
                }
            });

        } else {
            console.log("Empty attributes!");
            data["Message"] = "Bad request: Empty attributes!";
            res.status(400).json(data);
        }
    } else {
        console.log("You must fill category, type, quantity, customer and arrival_date");
        data["Message"] = "Bad request: You must fill category, type, quantity, customer and arrival_date";
        res.status(400).json(data);
    };
});
//----POST--END------------------------------------------------------------------------------
//----Delete------------------------------------------------------------------------------
//-deleting the product with the specific id

app.delete('/warehouse/products', function (req, res) {
    var data = {
        "Back to Warehouse": "/warehouse",
        "Go to Materials": "/warehouse/materials",
        "Go to Products": "/warehouse/products",
        "Message": ""
    };
    var query = req.query;

    //Test that the id has been given
    if (query.hasOwnProperty('id')) {
        // Test id value is not empty
        if (query.id.length != 0) {
            // Get the id 
            var id = query.id;
            //Check the if the id is in the database 
            var check_id = "SELECT product_id FROM products WHERE product_id='"+id+"'";
            connection.query(check_id, function (err, rows, fields) {
                //if id is found, the length of the rows is not 0 
                if (rows.length != 0) {
                    //product with this id can be deleted
                    connection.query("DELETE FROM products WHERE product_id='" + id + "'", function (err, rows, fields) {
                        if (err) {
                            console.log("Error Deleting data");
                            data["Message"] = "Error Deleting data";
                            res.status(404).json(data); //Not found
                        } else {

                            console.log("Product Deleted Successfully");
                            data["Message"] = "OK. Product Deleted Successfully.";
                            res.status(200).json(data); //OK
                        }
                    });
                    //id is not ofund in the database
                } else {
                    console.log("There is no product with id: " + id);
                    data["Message"] = "Bad request: there is no product with id: " + id;
                    res.status(404).json(data); //Not found
                }
            });

        } else {
            console.log("id value empty!");
            data["Message"] = "Bad request: id value empty!";
            res.status(400).json(data);
        }
    } else {
        console.log("You must fill id!")
        data["Message"] = "Bad request: You must fill id!";
        res.status(400).json(data);
    };
});

//-deleting the material with the specific id

app.delete('/warehouse/materials', function (req, res) {
    var data = {
        "Back to Warehouse": "/warehouse",
        "Go to Materials": "/warehouse/materials",
        "Go to Products": "/warehouse/products",
        "Message": ""
    };
    var query = req.query;

    //Test that the id has been given
    if (query.hasOwnProperty('id')) {
        // Test id value is not empty
        if (query.id.length != 0) {
            // Get the id 
            var id = query.id;
            //Check the if the id is in the database 
            var check_id = "SELECT material_id FROM materials WHERE material_id='" + id + "'";
            connection.query(check_id, function (err, rows, fields) {
                //if id is found, the length of the rows is not 0 
                if (rows.length != 0) {
                    //material with this id can be deleted
                    connection.query("DELETE FROM materials WHERE material_id='" + id + "'", function (err, rows, fields) {
                        if (err) {
                            console.log("Error Deleting data");
                            data["Message"] = "Error Deleting data";
                            res.status(404).json(data); //Not found
                        } else {

                            console.log("Material Deleted Successfully");
                            data["Message"] = "OK. Material Deleted Successfully.";
                            res.status(200).json(data); //OK
                        }
                    });
                    //id is not found in the database
                } else {
                    console.log("There is no material with id: " + id);
                    data["Message"] = "Bad request: there is no material with id: " + id;
                    res.status(404).json(data); //Not found
                }
            });

        } else {
            console.log("id value empty!");
            data["Message"] = "Bad request: id value empty!";
            res.status(400).json(data);
        }
    } else {
        console.log("You must fill id!")
        data["Message"] = "Bad request: You must fill id!";
        res.status(400).json(data);
    };
});
//----Delete----end--------------------------------------------------------------------------
//----UPDATE------------------------------------------------------------------------------
//----update sql field for a material with a certain id

app.put('/warehouse/materials', function (req, res) {
    var data = {
        "Back to Warehouse": "/warehouse",
        "Go to Materials": "/warehouse/materials",
        "Go to Products": "/warehouse/products",
        "Message": ""
    };
    var query = req.query;

    //Test that the id has been given
    if (query.hasOwnProperty('id')) {
        // Test id value is not empty
        if (query.id.length != 0) {
            var id = query.id;
            //Now check that the given id exists in the database. if no, we cant update it
            var check_id = "SELECT material_id FROM materials WHERE material_id='" + id + "'";
            connection.query(check_id, function (err, rows, fields) {
                if (rows.length != 0) {
                    // Update category
                    if (query.hasOwnProperty('category')) {
                        var category = query.category;
                        // Updates are done below - for each parameter there is if-statement, and if a new parameter is given, it is updated for the specified id
                        // updating category to given id
                        connection.query("UPDATE materials SET category='" + category + "'  WHERE material_id='" + id + "'", function (err, rows, fields) {
                            if (err) {
                                console.log("Error Updating data");
                                data["Message"] = "Error Updating data";
                                res.status(404).json(data); //Not found
                            } else {

                                console.log("Material Updated Successfully");
                                data["Message"] = "OK. Material Updated Successfully.";
                                res.status(200).json(data); //OK
                            }
                        });
                        // Update type
                    } else if (query.hasOwnProperty('type')) {
                        var type = query.type;
                        connection.query("UPDATE materials SET type='" + type + "'  WHERE material_id='" + id + "'", function (err, rows, fields) {
                            if (err) {
                                console.log("Error Updating data");
                                data["Message"] = "Error Updating data";
                                res.status(404).json(data); //Not found
                            } else {

                                console.log("Material Updated Successfully");
                                data["Message"] = "OK. Material Updated Successfully.";
                                res.status(200).json(data); //OK
                            }
                        });
                        // Update quntity
                    } else if (query.hasOwnProperty('quantity')) {
                        var quantity = query.quantity;
                        connection.query("UPDATE materials SET quantity='" + quantity + "'  WHERE material_id='" + id + "'", function (err, rows, fields) {
                            if (err) {
                                console.log("Error Updating data");
                                data["Message"] = "Error Updating data";
                                res.status(404).json(data); //Not found
                            } else {

                                console.log("Material Updated Successfully");
                                data["Message"] = "OK. Material Updated Successfully.";
                                res.status(200).json(data); //OK
                            }
                        });
                        //UPdate supplier
                    } else if (query.hasOwnProperty('supplier')) {
                        var supplier = query.supplier;
                        connection.query("UPDATE materials SET supplier='" + supplier + "'  WHERE material_id='" + id + "'", function (err, rows, fields) {
                            if (err) {
                                console.log("Error Updating data");
                                data["Message"] = "Error Updating data";
                                res.status(404).json(data); //Not found
                            } else {

                                console.log("Material Updated Successfully");
                                data["Message"] = "OK. Material Updated Successfully.";
                                res.status(200).json(data); //OK
                            }
                        });
                        //Update arrival_date
                    } else if (query.hasOwnProperty('arrival_date')) {
                        var arrival_date = arrival_date;
                        connection.query("UPDATE materials SET arrival_date='" + arrival_date + "'  WHERE material_id='" + id + "'", function (err, rows, fields) {
                            if (err) {
                                console.log("Error Updating data");
                                data["Message"] = "Error Updating data";
                                res.status(404).json(data); //Not found
                            } else {

                                console.log("Material Updated Successfully");
                                data["Message"] = "OK. Material Updated Successfully.";
                                res.status(200).json(data); //OK
                            }
                        });

                    } else {
                        console.log("You have no parametter to update!");
                        data["Message"] = "Bad request: you have no parameter to update!";
                        res.status(400).json(data);
                    };
                } else {
                    console.log("There is no material with id: " + id);
                    data["Message"] = "Bad request: there is no material with id: " + id;
                    res.status(404).json(data); //Not found
                }
            });
        } else {
            console.log("id value empty!");
            data["Message"] = "Bad request: id value empty!";
            res.status(400).json(data);
        }
    } else {
        console.log("You must fill id!")
        data["Message"] = "Bad request: You must fill id!";
        res.status(400).json(data);
    };
});

//----UPDATE products with a certain id---------------------------------------------------
app.put('/warehouse/products', function (req, res) {
    var data = {
        "Back to Warehouse": "/warehouse",
        "Go to Materials": "/warehouse/materials",
        "Go to Products": "/warehouse/products",
        "Message": ""
    };
    var query = req.query;

    //Test that the id has been given
    if (query.hasOwnProperty('id')) {
        // Test id value is not empty
        if (query.id.length != 0) {
            var id = query.id;
            //Now check that the given id exists in the database. if no, we cant update it
            var check_id = "SELECT product_id FROM products WHERE product_id='" + id + "'";
            connection.query(check_id, function (err, rows, fields) {
                if (rows.length != 0) {
                    // Updates are done below - for each parameter there is if-statement, and if a new parameter is given, it is updated for the specified id
                    // Update category
                    if (query.hasOwnProperty('category')) {
                        var category = query.category;
                        connection.query("UPDATE products SET category='" + category + "'  WHERE product_id='" + id + "'", function (err, rows, fields) {
                            if (err) {
                                console.log("Error Updating data");
                                data["Message"] = "Error Updating data";
                                res.status(404).json(data); //Not found
                            } else {

                                console.log("Product Updated Successfully");
                                data["Message"] = "OK. Product Updated Successfully.";
                                res.status(200).json(data); //OK
                            }
                        });
                        // Update type
                    } else if (query.hasOwnProperty('type')) {
                        var type = query.type;
                        connection.query("UPDATE productS SET type='" + type + "'  WHERE product_id='" + id + "'", function (err, rows, fields) {
                            if (err) {
                                console.log("Error Updating data");
                                data["Message"] = "Error Updating data";
                                res.status(404).json(data); //Not found
                            } else {

                                console.log("Product Updated Successfully");
                                data["Message"] = "OK. Product Updated Successfully.";
                                res.status(200).json(data); //OK
                            }
                        });
                        // Update quntity
                    } else if (query.hasOwnProperty('quantity')) {
                        var quantity = query.quantity;
                        connection.query("UPDATE products SET quantity='" + quantity + "'  WHERE product_id='" + id + "'", function (err, rows, fields) {
                            if (err) {
                                console.log("Error Updating data");
                                data["Message"] = "Error Updating data";
                                res.status(404).json(data); //Not found
                            } else {

                                console.log("Product Updated Successfully");
                                data["Message"] = "OK. Product Updated Successfully.";
                                res.status(200).json(data); //OK
                            }
                        });
                        //UPdate supplier
                    } else if (query.hasOwnProperty('customer')) {
                        var customer = query.customer;
                        connection.query("UPDATE products SET customer='" + customer + "'  WHERE product_id='" + id + "'", function (err, rows, fields) {
                            if (err) {
                                console.log("Error Updating data");
                                data["Message"] = "Error Updating data";
                                res.status(404).json(data); //Not found
                            } else {

                                console.log("Product Updated Successfully");
                                data["Message"] = "OK. Product Updated Successfully.";
                                res.status(200).json(data); //OK
                            }
                        });
                        //Update arrival_date
                    } else if (query.hasOwnProperty('arrival_date')) {
                        var arrival_date = arrival_date;
                        connection.query("UPDATE products SET arrival_date='" + arrival_date + "'  WHERE product_id='" + id + "'", function (err, rows, fields) {
                            if (err) {
                                console.log("Error Updating data");
                                data["Message"] = "Error Updating data";
                                res.status(404).json(data); //Not found
                            } else {

                                console.log("Product Updated Successfully");
                                data["Message"] = "OK. Product Updated Successfully.";
                                res.status(200).json(data); //OK
                            }
                        });

                    } else {
                        console.log("You have no parameter to update!");
                        data["Message"] = "Bad request: you have no parameter to update!";
                        res.status(400).json(data);

                    };
                } else {
                    console.log("There is no product with id: " + id);
                    data["Message"] = "Bad request: there is no product with id: " + id;
                    res.status(404).json(data); //Not found
                }
            });

        } else {
            console.log("id value empty!");
            data["Message"] = "Bad request: id value empty!";
            res.status(400).json(data);
        }
    } else {
        console.log("You must fill id!")
        data["Message"] = "Bad request: You must fill id!";
        res.status(400).json(data);
    };
});
//----UPDATE------------------------------------------------------------------------------

app.listen(80, function () {
    console.log('Server started.');
});