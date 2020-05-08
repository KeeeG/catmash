var mysql = require('mysql');
var config = require('./config.json');

var connection = mysql.createConnection({
    host     : config.dbhost,
    user     : config.dbuser,
    password : config.dbpassword,
    database : config.dbname,
});

exports.handler = (event, context, callback) => {
    connection.query('select * from elections', function (error, results, fields) {
        if (error) {
            connection.destroy();
            throw error;
        } else {
            console.log(results);
            callback(error, results);
            connection.end(function (err) { callback(err, results);});
        }
    });
};