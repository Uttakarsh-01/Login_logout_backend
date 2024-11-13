const cookieParser = require('cookie-parser');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const app = express();
const userModel = require("./models/user");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/create', (req, res) => {
    let { username, email, password, age } = req.body;

    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            console.error("Error generating salt:", err);
            return res.status(500).send("Error generating salt");
        }

        bcrypt.hash(password, salt, async (err, hash) => {
            if (err) {
                console.error("Error hashing password:", err);
                return res.status(500).send("Error hashing password");
            }

            try {
                let createdUser = await userModel.create({
                    username,
                    email,
                    password: hash,
                    age
                });

                let token = jwt.sign({ email }, "utthakf", { expiresIn: '1h' });
                
                // Set token as a cookie
                res.cookie("token", token, { httpOnly: true });
                res.send(createdUser);
            } catch (error) {
                console.error("Error creating user:", error);
                res.status(500).send("Error creating user");
            }
        });
    });
});

app.get("/login",function(req,res){
    res.render('login');
})
app.post("/login",async function(req,res){
  let user =  await userModel.findOne({email:req.body.email})
    if(!user) return res.send("something went wrong");


    bcrypt.compare(req.body.password,user.password,function(err,result){
        if(result) {
            let token = jwt.sign({email:user.email},"shhhhhhhh");
            res.cookie("token",token);
            res.send("you can login");
        }
        else res.send("something is wrong");  
         
    })
});

app.get("/logout",function(req,res){
    res.cookie("token","");
    res.redirect("/");
})

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});






















// const cookieParser = require('cookie-parser');
// const express = require('express');
// const app = express();
// const userModel = require("./models/user");
// const bcrypt = require('bcrypt');
// const path = require('path');
// const jwt = require('jsonwebtoken');

// app.set("view engine","ejs");
// app.use(express.json());
// app.use(express.urlencoded({extended:true}));
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(cookieParser());

// app.get('/',(req,res)=>{
//     res.render('index');
// });


// app.post('/create',(req,res)=>{
//     let {username,email,password,age} = req.body;

//     bcrypt.genSalt(10,(err,salt)=>{
//         bcrypt.hash(password,salt,async(err,hash) => {

// let createdUser =  await userModel.create({
//         username,
//         email,
//         password:hash,
//         age
//     })

//     let token = jwt.sign({email},"utthakf");
//     res.token("token",token);
//               res.send(createdUser);
//           })
//     })
       
// });


// app.listen(3000);