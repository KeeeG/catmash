var mysql = require('mysql');
var config = require('./config.json');
var fs = require("fs");
var json = JSON.parse(fs.readFileSync('./cats.json'));
var query;
var queryResults = [];
// DB Connections params
var connection = mysql.createConnection({
    host     : config.dbhost,
    user     : config.dbuser,
    password : config.dbpassword,
    database : config.dbname,
});

exports.handler = (event, context, callback) => {
  
  // Parsing the JSON file, cat by cat  
  for (var i in json.images) {

  	// Counting the cat's votes, adding the cat id and it's URL
  	query = 'select IFNULL( cat_id, "'+ json.images[i].id +'" ) as cat_id, count(*) as votes, "'+ json.images[i].url +'" as url from elections WHERE cat_id = "'+ json.images[i].id +'"';
        connection.query(query , function (error, results, fields) {
            if (error) {
                connection.destroy();
                throw error;
            } else {

            	//pushing the results into one multidimentional array
                queryResults.push([ results[0].cat_id , JSON.stringify(results[0].votes), results[0].url]);
            }
        });
        
    }
    // sorting the array
    queryResults = queryResults.sort(function(a,b, c) {
        return b[1] - a[1];
    });
    
    callback(null, queryResults);
    connection.end(function (err) { callback(err, queryResults);});
};
