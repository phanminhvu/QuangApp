const express = require("express");
const userRouter = require("./routers/user");
const authRouter = require("./routers/auth");
const emailRouter = require("./routers/email");
const AppRouter = require("./routers/appDetail");
const AppConfig = require("./routers/appConfig");

var cors = require('cors')
const port = process.env.PORT;
require("./db/db");

const app = express();


app.use(cors())
app.use(express.json());
app.use('/users',userRouter);
app.use('/auth',authRouter);
app.use('/mail',emailRouter);
app.use('/app',AppRouter);
app.use('/app-config',AppConfig);
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});