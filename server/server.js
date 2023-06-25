const express = require('express');
const session = require('express-session')
const mongoose= require('mongoose')
const MongoDBSession= require('connect-mongodb-session')(session);
const app = express()
const port =3000
const mongoUri ='mongodb://127.0.0.1:27017/session' 
const userModel = require('./models/user');
const bcrypt = require('bcryptjs')
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
app.set("view engine", "ejs")
app.use(express.urlencoded({extended:true}));


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

app.get('/register',(req,res)=>{
    res.render("register")
})

app.post('/register',async(req,res)=>{
  const {username,email ,password } = req.body
    
  let user = await userModel.findOne(emai)
  
  if(user){
     return res.redirect('/register')
  }

   const hashedPsw = await bcrypt.hash(password,12)
 
  user = new userModel({
    username,
    email,
    password:hashedPsw
  })

   await user.save();

})



app.listen(port, ()=>{
     console.log(`Server is runing on ${port}`);
})