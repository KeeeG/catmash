var mysql = require('mysql');
var config = require('./config.json');

exports.handler = (event, context, callback) => {
    
    // DB Connections params
    var connection = mysql.createConnection({
        host     : config.dbhost,
        user     : config.dbuser,
        password : config.dbpassword,
        database : config.dbname,
    });
    
    connection.query('INSERT INTO elections (cat_id) VALUES ("' + event.cat_id +'")', function (error, results, fields) {
        if (error) {
            connection.destroy();
            throw error;
        } else {
            // connected!
            console.log(results);
            callback(error, results);
            connection.end(function (err) { callback(err, results);});
        }
    });
};