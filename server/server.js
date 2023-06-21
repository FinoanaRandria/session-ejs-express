const express = require('express');
const session = require('express-session')
const mongoose= require('mongoose')
const MongoDBSession= require('connect-mongodb-session')(session);
const app = express()
const port =3000


mongoose.connect('mongodb://127.0.0.1:27017/session', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Mongodb is connected!');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

app.use(session({
  secret: 'key',
  resave: false,
  saveUninitialized:false
}))


app.get('/', (req,res)=>{
  console.log(req.session);
  res.send('hello')
})



app.listen(port, ()=>{
     console.log(`Server is runing on ${port}`);
})