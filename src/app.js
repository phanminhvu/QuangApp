require('dotenv').config();
const express = require("express");
var https = require('https');
var fs = require('fs');

const userRouter = require("./routers/user");
const authRouter = require("./routers/auth");
const emailRouter = require("./routers/email");
const AdminRouter = require("./routers/admin");
const App1Router = require("./routers/app1");

require("./db/db");

var cors = require('cors');
const port = process.env.PORT;


const app = express();
var options = {
    key: fs.readFileSync('./SSL/scanapp.vn.key'),
    cert: fs.readFileSync('./SSL/scanapp.vn.cert'),
    ca: [fs.readFileSync('./SSL/scanapp.vn.cacert')],
  };

app.use(cors())
app.use(express.json());
app.use('/auth',authRouter);
app.use('/admin',AdminRouter);;
app.use('/users',userRouter);
app.use('/app1',App1Router);
app.get('/heath', (req, res) => {console.log("Heath"); res.send("Server running")});

// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });
var debug = require('debug')('scantomail:server');
var server = https.createServer(options, app);
server.listen(port);
console.log(`server running with port ${port}`)
server.on('error', onError);
server.on('listening', onListening);
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  }
  
  /**
   * Event listener for HTTP server "error" event.
   */
  
  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }
  
    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }
  
  /**
   * Event listener for HTTP server "listening" event.
   */
  
  function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }
  
