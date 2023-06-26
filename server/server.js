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

/* midlleware checking auth */
 const isAuth = (req,res,next)=>{
     if(req.session.isAuth){
        next()
     }else{
        res.redirect('/login')
     }
 }



app.get('/', (req,res)=>{
  req.session.isAuth = true;
  res.send('hello home pages')
})

app.get('/login',(req,res)=>{
  res.render("login")
})

app.post('/login', async(req,res)=>{
     const {email,password} =req.body

     const user  = await userModel.findOne({email})

     if(!user){
       return  res.redirect('/login')
     }

     const isMatch = await bcrypt.compare(password, user.password)


     if(!isMatch){
       return res.redirect('/login')
     }

          req.session.isAuth = true;
     res.redirect("/dasboard")
})

app.get('/register',(req,res)=>{
    res.render("register")
})

app.post('/register',async(req,res)=>{
  const {username,email ,password } = req.body
    
  let user = await userModel.findOne({email})
  
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
     res.redirect('/login')
})

app.get('/dasboard',isAuth, (req,res)=>{
   res.render('dashboard')
}) 


app.post('/logout', (req, res) => {
  req.session.isAuth = false;
  req.session.destroy((err) => {
    if (err) {
      throw err;
    }
    res.redirect('/');
  });
});


app.listen(port, ()=>{
     console.log(`Server is runing on ${port}`);
})