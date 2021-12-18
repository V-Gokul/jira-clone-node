 const express = require("express");
 const morgan = require("morgan");
 const session = require("express-session");

 const epicsRouter = require("./conrollers/epic-controller");
 const categoryRouter = require("./conrollers/categories-controller");
 const itemRouter = require("./conrollers/items-controller");
 const userRouter = require("./conrollers/users-controller");
// const res = require("express/lib/response");

 const app = express();
 app.use(morgan("combined"));
 app.use(
     session({
         secret: "keybord cat",
         resave: false,
         saveUninitialized: true,
         cookie: { secure: false,maxAge:60000},
     })
 );
 app.use(async function (req,res, next){
    try {
        await next();
    } catch (err){
        console.error("something went worng",err);
        res.status(500).send({
            message: "Internal server error",
        });
   
    }
 });
 app.use(express.json());

 app.use("/api/v1/epics",epicsRouter);
 app.use("/api/v1/categories",categoryRouter);
 app.use("/api/v1/items",itemRouter);
 app.use("/api/v1/auth",userRouter);

 app.get("/hello", (req,res)=>{
     if(req.session.count) {
         req.session.count++;
     } else{
         req.session.count = 1;
     }
     res.send({message: "world", count: req.session.count});

 });

 app.listen(3000);
  