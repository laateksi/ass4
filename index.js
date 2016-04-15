// server

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


//GET---------------------------------------------------------------------------
app.get('/warehouse', function (req, res) {
    var warehouseView = {
        materials: "/warehouse/materials",
        products: "/warehouse/products"
    };
    res.send(warehouseView);
});

app.get('/warehouse/materials', function (req, res) {
    var data = {
        "Back to Warehouse": "/warehouse",
        "error": 1,
        "Materials": ""
    };

    var materialsView = {
        back_to_warehouse: "/warehouse",
        products: "/warehouse/products"
    };

    connection.query("SELECT * from materials", function (err, rows, fields) {
        if (rows.length != 0) {
            data["error"] = 0;
            data["Materials"] = rows;
            res.status(200).json(data);
        } else {
            data["Materials"] = 'No materials found..';
            res.status(404).json(data);
        }
    });
});

app.get('/warehouse/products', function (req, res) {
    var data = {
        "Back to Warehouse": "/warehouse",
        "error": 1,
        "Products": ""
    };

    connection.query("SELECT * from products", function (err, rows, fields) {
        if (rows.length != 0) {
            data["error"] = 0;
            data["Products"] = rows;
            res.status(200).json(data);
        } else {
            data["Products"] = 'No products found..';
            res.status(404).json(data);
        }
    });
});
//--------------------------------------------------------GET----------------

//-POST----------------------------------------------------------------------
//--Materials

app.post('/warehouse/materials', function (req, res) {
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

            // inserting data to mySQL
            connection.query("INSERT INTO materials (material_id,category,type,quantity,supplier,arrival_date) VALUES ('" + id + "','" + category + "','" + type + "','" + quantity + "','" + supplier + "','" + date + "')", function (err, rows, fields) {
                if (err) {
                    console.log("Error Adding data: " + err);
                    data = "Error Adding data";
                    //respond to postman
                    res.status(400).json(data); //400 Query not complete
                } else {

                    console.log("Material Created Successfully");
                    data = "Material Created Successfully";
                    //respond to postman
                    res.status(201).json(data); //201: Created
                }
            });

        } else {
            console.log("Empty attributes!")
            data = "Bad request: Empty attributes!";
            res.status(400).json(data); //Bad request
        }
    } else {
        console.log("You must fill category, type, quantity, supplier and arrival_date");
        data = "You must fill category, type, quantity, supplier and arrival_date";
        res.status(400).json(data);
    };
});

//-Products----------------------------------------------
app.post('/warehouse/products', function (req, res) {
    var query = req.query;

    //Test all attributes are given (id, category, type, quantity, supplier, arrival_date)
    if (query.hasOwnProperty('category') && query.hasOwnProperty('type')
        && query.hasOwnProperty('quantity') && query.hasOwnProperty('customer') && query.hasOwnProperty('arrival_date')) {
        // Test that attributes are not empty
        if (query.category.length != 0 && query.type.length != 0
            && query.quantity.length != 0 && query.customer.length != 0 && query.arrival_date.length != 0) {

            var id = uuid.v4()
            var category = query.category;
            var type = query.type;
            var quantity = query.quantity;
            var customer = query.customer;
            var date = query.arrival_date;

            connection.query("INSERT INTO products (product_id,category,type,quantity,customer,arrival_date) VALUES ('" + id + "','" + category + "','" + type + "','" + quantity + "','" + customer + "','" + date + "')", function (err, rows, fields) {
                if (err) {
                    console.log("Error Adding data");
                    data = "Error Adding data";
                    res.status(400).json(data);
                } else {

                    console.log("Product Added Successfully");
                    data = "Product Added Successfully";
                    res.status(201).json(data);
                }
            });

        } else {
            console.log("Empty attributes!");
            data = "Bad request: Empty attributes!";
            res.status(400).json(data);
        }
    } else {
        console.log("You must fill category, type, quantity, customer and arrival_date");
        data = "Bad request: You must fill category, type, quantity, customer and arrival_date";
        res.status(400).json(data);
    };
});
//----POST--------------------------------------------------------------------------------
//----Delete------------------------------------------------------------------------------
//-deleting the product with the specific id

app.delete('/warehouse/products', function (req, res) {
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
                    //id can be deleted
                    connection.query("DELETE FROM products WHERE product_id='" + id + "'", function (err, rows, fields) {
                        if (err) {
                            console.log("Error Deleting data");
                            data = "Error Deleting data";
                            res.status(404).json(data); //Not found
                        } else {

                            console.log("Product Deleted Successfully");
                            data = "OK. Product Deleted Successfully.";
                            res.status(200).json(data); //OK
                        }
                    });
                    //id is not ofund in the database
                } else {
                    console.log("There is no product with id: " + id);
                    data = "Bad request: there is no product with id: " + id;
                    res.status(404).json(data); //Not found
                }
            });

        } else {
            console.log("id value empty!");
            data = "Bad request: id value empty!";
            res.status(400).json(data);
        }
    } else {
        console.log("You must fill id!")
        data = "Bad request: You must fill id!"; 
        res.status(400).json(data);
    };
});
//----Delete------------------------------------------------------------------------------
//----UPDATE------------------------------------------------------------------------------
//----update sql field for a material with a certain id

app.put('/warehouse/materials', function (req, res) {
    var query = req.query;

    //Test that the id has been given
    if (query.hasOwnProperty('id')) {
        // Test id value is not empty
        if (query.id.length != 0) {
            var id = query.id;
            
            // Update category
            if (query.hasOwnProperty('category')) {
                var category = query.category;
                connection.query("UPDATE materials SET category='" + category + "'  WHERE material_id='" + id + "'", function (err, rows, fields) {
                    if (err) {
                        console.log("Error Updating data");
                        data = "Error Updating data";
                        res.status(404).json(data); //Not found
                    } else {

                        console.log("Material Updated Successfully");
                        data = "OK. Material Updated Successfully.";
                        res.status(200).json(data); //OK
                    }
                });
                // Update type
            } else if (query.hasOwnProperty('type')) {
                var type = query.type;
                connection.query("UPDATE materials SET type='" + type + "'  WHERE material_id='" + id + "'", function (err, rows, fields) {
                    if (err) {
                        console.log("Error Updating data");
                        data = "Error Updating data";
                        res.status(404).json(data); //Not found
                    } else {

                        console.log("Material Updated Successfully");
                        data = "OK. Material Updated Successfully.";
                        res.status(200).json(data); //OK
                    }
                });
                // Update quntity
            } else if (query.hasOwnProperty('quantity')) {
                var quantity = query.quantity;
                connection.query("UPDATE materials SET quantity='" + quantity + "'  WHERE material_id='" + id + "'", function (err, rows, fields) {
                    if (err) {
                        console.log("Error Updating data");
                        data = "Error Updating data";
                        res.status(404).json(data); //Not found
                    } else {

                        console.log("Material Updated Successfully");
                        data = "OK. Material Updated Successfully.";
                        res.status(200).json(data); //OK
                    }
                });
                //UPdate supplier
            } else if (query.hasOwnProperty('supplier')) {
                var supplier = query.supplier;
                connection.query("UPDATE materials SET supplier='" + supplier + "'  WHERE material_id='" + id + "'", function (err, rows, fields) {
                    if (err) {
                        console.log("Error Updating data");
                        data = "Error Updating data";
                        res.status(404).json(data); //Not found
                    } else {

                        console.log("Material Updated Successfully");
                        data = "OK. Material Updated Successfully.";
                        res.status(200).json(data); //OK
                    }
                });
                //Update arrival_date
            } else if (query.hasOwnProperty('arrival_date')) {
                var arrival_date = arrival_date;
                connection.query("UPDATE materials SET arrival_date='" + arrival_date + "'  WHERE material_id='" + id + "'", function (err, rows, fields) {
                    if (err) {
                        console.log("Error Updating data");
                        data = "Error Updating data";
                        res.status(404).json(data); //Not found
                    } else {

                        console.log("Material Updated Successfully");
                        data = "OK. Material Updated Successfully.";
                        res.status(200).json(data); //OK
                    }
                });

            } else {
                console.log("You have no parametter to update!");
                data = "Bad request: you have no parametter to update!";
                res.status(400).json(data);
                
            };
            

        } else {
            console.log("id value empty!");
            data = "Bad request: id value empty!";
            res.status(400).json(data);
        }
    } else {
        console.log("You must fill id!")
        data = "Bad request: You must fill id!";
        res.status(400).json(data);
    };
});

//----UPDATE products with a certain id---------------------------------------------------
app.put('/warehouse/products', function (req, res) {
    var query = req.query;

    //Test that the id has been given
    if (query.hasOwnProperty('id')) {
        // Test id value is not empty
        if (query.id.length != 0) {
            var id = query.id;

            // Update category
            if (query.hasOwnProperty('category')) {
                var category = query.category;
                connection.query("UPDATE products SET category='" + category + "'  WHERE product_id='" + id + "'", function (err, rows, fields) {
                    if (err) {
                        console.log("Error Updating data");
                        data = "Error Updating data";
                        res.status(404).json(data); //Not found
                    } else {

                        console.log("Product Updated Successfully");
                        data = "OK. Product Updated Successfully.";
                        res.status(200).json(data); //OK
                    }
                });
                // Update type
            } else if (query.hasOwnProperty('type')) {
                var type = query.type;
                connection.query("UPDATE productS SET type='" + type + "'  WHERE product_id='" + id + "'", function (err, rows, fields) {
                    if (err) {
                        console.log("Error Updating data");
                        data = "Error Updating data";
                        res.status(404).json(data); //Not found
                    } else {

                        console.log("Product Updated Successfully");
                        data = "OK. Product Updated Successfully.";
                        res.status(200).json(data); //OK
                    }
                });
                // Update quntity
            } else if (query.hasOwnProperty('quantity')) {
                var quantity = query.quantity;
                connection.query("UPDATE products SET quantity='" + quantity + "'  WHERE product_id='" + id + "'", function (err, rows, fields) {
                    if (err) {
                        console.log("Error Updating data");
                        data = "Error Updating data";
                        res.status(404).json(data); //Not found
                    } else {

                        console.log("Product Updated Successfully");
                        data = "OK. Product Updated Successfully.";
                        res.status(200).json(data); //OK
                    }
                });
                //UPdate supplier
            } else if (query.hasOwnProperty('customer')) {
                var customer = query.customer;
                connection.query("UPDATE products SET customer='" + customer + "'  WHERE product_id='" + id + "'", function (err, rows, fields) {
                    if (err) {
                        console.log("Error Updating data");
                        data = "Error Updating data";
                        res.status(404).json(data); //Not found
                    } else {

                        console.log("Product Updated Successfully");
                        data = "OK. Product Updated Successfully.";
                        res.status(200).json(data); //OK
                    }
                });
                //Update arrival_date
            } else if (query.hasOwnProperty('arrival_date')) {
                var arrival_date = arrival_date;
                connection.query("UPDATE products SET arrival_date='" + arrival_date + "'  WHERE product_id='" + id + "'", function (err, rows, fields) {
                    if (err) {
                        console.log("Error Updating data");
                        data = "Error Updating data";
                        res.status(404).json(data); //Not found
                    } else {

                        console.log("Product Updated Successfully");
                        data = "OK. Product Updated Successfully.";
                        res.status(200).json(data); //OK
                    }
                });

            } else {
                console.log("You have no parametter to update!");
                data = "Bad request: you have no parametter to update!";
                res.status(400).json(data);

            };


        } else {
            console.log("id value empty!");
            data = "Bad request: id value empty!";
            res.status(400).json(data);
        }
    } else {
        console.log("You must fill id!")
        data = "Bad request: You must fill id!";
        res.status(400).json(data);
    };
});
//----UPDATE------------------------------------------------------------------------------

app.listen(80, function () {
    console.log('Server started.');
}
);