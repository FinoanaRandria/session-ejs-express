const express = require('express');
const session = require('express-session')
const mongoose= require('mongoose')
const MongoDBSession= require('connect-mongodb-session')(session);
const app = express()
const port =3000
const mongoUri ='mongodb://127.0.0.1:27017/session' 

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Mongodb is connected!');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});


const store = new MongoDBSession({
  uri:mongoUri,
  collection:"mySessions"
})

app.use(session({
  secret: 'key',
  resave: false,
  saveUninitialized:false,
  store:store
}))


app.get('/', (req,res)=>{
  req.session.isAuth = true;
  res.send('hello')
})



app.listen(port, ()=>{
     console.log(`Server is runing on ${port}`);
})