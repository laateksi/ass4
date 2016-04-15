            else if (query.hasOwnProperty('assign')) {
                var assign = query.assign;
                
                // Make sure that production id exists
                connection.query("SELECT product_id FROM products WHERE product_id='" + assign + "'", function (err, rows, fields) {
                    if (err) {
                        console.log("Error: "+err);
                        data["Message"] = "Error. Try explore /warehouse/products";
                        res.status(404).json(data); //Not found
                    } else if (rows.length == 0) {
                        console.log("Product id "+ assign +" does not exist");
                        data["Message"] = "Product id not found. Try explore /warehouse/products";
                        res.status(404).json(data); //Not found
                    } else {
                        //Check if material id exists
                        connection.query("SELECT material_id FROM materials WHERE material_id='" + id + "'", function (err, rows, fields) {
                            if (err) {
                                console.log("Error: "+err);
                                data["Message"] = "Error finding material_id. Try explore /warehouse/materials";
                                res.status(404).json(data); //Not found
                            } else if (rows.length == 0) {
                                console.log("Error finding material_id");
                                data["Message"] = "Error finding material_id. Try explore /warehouse/materials";
                                res.status(404).json(data); //Not found
                            } else {
                                // Check if materials are assigned already
                                connection.query("SELECT assigned FROM materials WHERE material_id='" + id + "'", function (err, rows, fields) {
                                    if (rows[0].assigned!=null) {
                                        //console.log(rows);
                                        console.log("Material already assigned.");
                                        data["Message"] = "Material already assigned. Try explore /warehouse/materials";
                                        //console.log(rows.length);
                                        //console.log(rows[0].assigned);
                                        res.status(403).json(data); //Forbidden
                                    } else if (err) {
                                        console.log("Error when assigning materials: "+err);
                                        data["Message"] = "Error when assigning materials.";
                                        res.status(404).json(data); //Not found
                                    } else {
                                        connection.query("UPDATE materials SET assigned='" + assign + "'  WHERE material_id='" + id + "'", function (err, rows, fields) {
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
                                    }
                                });
                            }
                        });
                    }
                });
                //Update arrival_date
            }
