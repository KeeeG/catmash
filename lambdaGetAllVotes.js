var mysql = require('mysql');
var config = require('./config.json');
var fs = require("fs");
var json = JSON.parse(fs.readFileSync('./cats.json'));
var cats = [];
var query;
var queryResults = [];
var connection = mysql.createConnection({
    host     : config.dbhost,
    user     : config.dbuser,
    password : config.dbpassword,
    database : config.dbname,
});

exports.handler = (event, context, callback) => {
  
  for (var i in json.images) {
  	query = 'select IFNULL( cat_id, "'+ json.images[i].id +'" ) as cat_id, count(*) as votes from elections WHERE cat_id = "'+ json.images[i].id +'"';
        connection.query(query , function (error, results, fields) {
            if (error) {
                connection.destroy();
                throw error;
            } else {
                queryResults.push([ results[0].cat_id , JSON.stringify(results[0].votes)]);
            }
        });
        
    }
    
    // sorting the table
    queryResults = queryResults.sort(function(a,b) {
        return b[1] - a[1];
    });  
    callback(null, queryResults);
    connection.end(function (err) { callback(err, queryResults);});
};
