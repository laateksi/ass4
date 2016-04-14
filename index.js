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
        console.log("Error...");
        console.log(err);
        process.exit(1);
    }
});


//GET---------------------------------------------------------------------------
app.get('/materials', function (req, res) {
    var data = {
        "error": 1,
        "Materials": ""
    };

    connection.query("SELECT * from materials", function (err, rows, fields) {
        if (rows.length != 0) {
            data["error"] = 0;
            data["Materials"] = rows;
            res.json(data);
        } else {
            data["Materials"] = 'No thigs Found..';
            res.json(data);
        }
    });
});

app.get('/products', function (req, res) {
    var data = {
        "error": 1,
        "Products": ""
    };

    connection.query("SELECT * from products", function (err, rows, fields) {
        if (rows.length != 0) {
            data["error"] = 0;
            data["Products"] = rows;
            res.json(data);
        } else {
            data["Products"] = 'No things Found..';
            res.json(data);
        }
    });
});
//--------------------------------------------------------GET----------------

//-POST----------------------------------------------------------------------
//--Materials

app.post('/materials', function (req, res) {
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
            connection.query("INSERT INTO materials (material_id,category,type,quantity,supplier,arrival_date) VALUES ('"+id+"','"+category+"','"+type+"','"+quantity+"','"+supplier+"','"+date+"')", function (err, rows, fields) {
                if (err) {
                    console.log("Error Adding data: " + err);
                    data = "Error Adding data";
                } else {
                    
                    console.log("Material Added Successfully");
                    data = "Material Added Successfully";
                }
                //respond to postman
                res.json(data);
            });
            
        } else {
            console.log("Empty attributes!")
            data = "Empty attributes!";
            res.json(data);
        }
    } else {
        console.log("You must fill category, type, quantity, supplier and arrival_date");
        data = "You must fill category, type, quantity, supplier and arrival_date";
        res.json(data);
    };
});

//-Products----------------------------------------------
app.post('/products', function (req, res) {
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

            connection.query("INSERT INTO products (product_id,category,type,quantity,customer,arrival_date) VALUES ('"+id+"','"+category+"','"+type+"','"+quantity+"','"+customer+"','"+date+"')", function (err, rows, fields) {
                if (err) {
                    console.log("Error Adding data");
                    data = "Error Adding data";
                } else {

                    console.log("Product Added Successfully");
                    data = "Product Added Successfully";
                }
                res.json(data);
            });

        } else {
            console.log("Empty attributes!");
            data = "Empty attributes!";
            res.json(data);
        }
    } else {
        console.log("You must fill category, type, quantity, customer and arrival_date");
        data = "You must fill category, type, quantity, customer and arrival_date";
        res.json(data);
    };
});
//----POST--------------------------------------------------------------------------------
//----Delete------------------------------------------------------------------------------
//-deleting the product with the specific id

app.delete('/products', function (req, res) {
    var query = req.query;

    //Test that the id has been given
    if (query.hasOwnProperty('id')) {
        // Test id value is not empty
        if (query.id.length != 0) {

            var id = query.id;

            connection.query("DELETE FROM products WHERE product_id='" + id+"'", function (err, rows, fields) {
                if (err) {
                    console.log("Error Deleting data");
                    data = "Error Deleting data";
                } else {

                    console.log("Product Deleted Successfully");
                    data = "Product Deleted Successfully";
                }
                res.json(data);
            });

        } else {
            console.log("id value empty!");
            data = "id value empty!";
            res.json(data);
        }
    } else {
        console.log("You must fill id!")
        data = "You must fill id!";
        res.json(data);
    };
});

//-deleting the material with the specific id

app.delete('/materials', function (req, res) {
    var query = req.query;

    //Test that the id has been given
    if (query.hasOwnProperty('id')) {
        // Test id value is not empty
        if (query.id.length != 0) {

            var id = query.id;

            connection.query("DELETE FROM materials WHERE material_id='" + id + "'", function (err, rows, fields) {
                if (err) {
                    console.log("Error Deleting data");
                    data = "Error Deleting data";
                } else {

                    console.log("Material Deleted Successfully");
                    data = "Material Deleted Successfully";
                }
                res.json(data);
            });

        } else {
            console.log("id value empty!");
            data = "id value empty!";
            res.json(data);
        }
    } else {
        console.log("You must fill id!")
        data = "You must fill id!";
        res.json(data);
    };
});

//----Delete------------------------------------------------------------------------------

    app.listen(80, function() {
        console.log('Server started.');}
    );

