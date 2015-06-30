/**
 * Created by khancode on 5/22/15.
 */

function userRouter(express, pool) {
    router = express.Router(); // get an instance of the express Router

    router.post('/verify', function(req, res) {

        var username = req.body.username;
        var password = req.body.password;

        //console.log('username received: ' + username);
        //console.log('password received: ' + password);

        pool.getConnection(function(err, connection){
            var query = "SELECT * FROM User WHERE Username='"+username+"' AND Password='"+password+"'";
            connection.query(query, function(err, rows) {
                connection.release();

                if(err)
                    throw err;
                else
                {
                    //console.log(rows);

                    var authentic;
                    if (rows.length == 0)
                        authentic = false;
                    else
                        authentic = true;

                    res.json({authentic:authentic});
                }
            });

        });
    });

    router.post('/create', function(req, res) {

        var username = req.body.username;
        var password = req.body.password;

        var email = req.body.email;
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;

        var uid;

        checkIfUsernameExists();

        function checkIfUsernameExists() {
            pool.getConnection(function(err, connection){
                var query = "SELECT Username FROM User WHERE Username='"+username+"'";
                connection.query(query, function(err, rows) {
                    connection.release();

                    if(err)
                        throw err;
                    else
                    {
                        if (rows.length == 0)
                            insertIntoUserTable();
                        else
                            res.json({success: false, error: 'username_exists'});
                    }
                });

            });
        }

        function insertIntoUserTable() {
            pool.getConnection(function(err, connection){
                var query = "INSERT INTO User (Username, Password) VALUES ('"+username+"', '"+password+"')";
                connection.query(query, function(err, result) {
                    connection.release();

                    if(err) {
                        if (err.code == 'ER_DUP_ENTRY')
                            res.json({success:false, error:'ER_DUP_ENTRY_in_User_table(THIS SHOULD NOT HAPPEN)'});
                        else
                            throw err;
                    }
                    else
                    {
                        if (result.affectedRows == 1) {
                            uid = result.insertId;
                            //console.log('uid: ' + uid);

                            insertIntoProfileTable();
                        }
                        else
                            throw err;
                    }
                });

            });
        }

        function insertIntoProfileTable() {
            pool.getConnection(function(err, connection){
                var query = "INSERT INTO Profile (UID, Username, Email, FirstName, LastName) VALUES ('"+uid+"', '"+username+"', '"+
                            email+"', '"+firstName+"', '"+lastName+"')";
                connection.query(query, function(err, result) {
                    connection.release();

                    if(err) {
                        if (err.code == 'ER_DUP_ENTRY')
                            res.json({success:false, error:'ER_DUP_ENTRY_in_Profile_table(THIS SHOULD NOT HAPPEN)'});
                        else
                            throw err;
                    }
                    else
                    {
                        if (result.affectedRows == 1)
                            res.json({success:true});
                        else
                            throw err;
                    }
                });

            });
        }
    });

    return router; // return the custom router
}

module.exports = userRouter;