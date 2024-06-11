const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const dotenv = require("dotenv");


dotenv.config();
const app = express();
const authRouter = require("./routes/api/auth");
const usersRouter = require("./routes/api/users");
const leadsRouter = require('./routes/api/leads');
const findsRouter = require('./routes/api/finds');
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';


app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
// app.use(express.static("public"));


app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/leads', leadsRouter);
app.use('/finds', findsRouter)


app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
});


app.use((err, req, res, next) => {
  const {status = 500, message= "Server Error"} = err;
  res.status(status).json({ message })
});


module.exports = app;
