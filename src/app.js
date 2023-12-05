const express = require("express");
const userRouter = require("./routers/user");
const authRouter = require("./routers/auth");
const emailRouter = require("./routers/email");
const AdminRouter = require("./routers/admin");
const App1Router = require("./routers/app1");

require("./db/db");

var cors = require('cors')
const port = process.env.PORT;


const app = express();

app.use(cors())
app.use(express.json());
app.use('/auth',authRouter);
app.use('/admin',AdminRouter);;
app.use('/app1/mail',emailRouter);
app.use('/users',userRouter);
app.use('/app1',App1Router);
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});