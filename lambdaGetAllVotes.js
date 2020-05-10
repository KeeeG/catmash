var mysql = require('mysql');
var config = require('./config.json');
var fs = require("fs");
var json = JSON.parse(fs.readFileSync('./cats.json'));
var query;
var queryResults = [];


exports.handler = (event, context, callback) => {
    
    // DB Connections params
    var connection = mysql.createConnection({
        host     : config.dbhost,
        user     : config.dbuser,
        password : config.dbpassword,
        database : config.dbname,
    });
  
  // Parsing the JSON file, cat by cat  
  for (var i in json.images) {

  	// Counting the cat's votes, adding the cat id and it's URL
  	query = 'select IFNULL( cat_id, "'+ json.images[i].id +'" ) as cat_id, count(*) as votes, "'+ json.images[i].url +'" as url from elections WHERE cat_id = "'+ json.images[i].id +'"';
        connection.query(query , function (error, results, fields) {
            if (error) {
                connection.destroy();
                throw error;
            } else {
                queryResults.push([ results[0].cat_id , JSON.stringify(results[0].votes), results[0].url]);
            }
        });
        
    }
    
    // sorting the array
    queryResults = queryResults.sort(function(a,b, c) {
        return b[1] - a[1];
    });
    
    var o = {} // empty Object
    var key = 'catsElections';
    o[key] = []; // empty Array, which you can push() values into
    
    // building a json return
    for (var j in queryResults){
        var data = {
            cat_id: queryResults[j][0],
            votes: queryResults[j][1],
            url: queryResults[j][2]
        }
        o[key].push(data);
    }
    callback(null, o);
    connection.end(function (err) { callback(err, o);});
};