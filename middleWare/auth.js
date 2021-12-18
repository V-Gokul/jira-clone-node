const db = require("../db");

function authorizeRequest(req,res, next){
    if (req.headers.authoriztion){
        const userName = req.headers.authorization;
        if (userName === "admin"){
            next();
            return;
        }
    }
    res.status(401).send({message:"Unauthorized"});
}

// async function authenticateUser(req,res, next) {
//     const userInfo = req.headers.authorization;
//     const [username,password] = userInfo.split("_")

//     if(username) {
//         const user = await db("users").select().where("username",username).first();

//         if(user && user.password === password){
//             req.user = user;
//         }
//     }
//     // next();
// }

async function basicAuthenticateUser(req,res,next){
    const userInfo = req.headers.authorization;
    console.log(userInfo,"cjkdhsjvcjkvk");
    
    if(!userInfo){
        return next();
    }
    console.log("hdghjadgckc",userInfo);
    const credentials = userInfo.split(" ")[1];
    console.log(credentials);

    if (credentials) {
        const decoded = Buffer.from(credentials, "base64").toString();
        console.log(decoded,"decode");
        const [username,password] = decoded.split(":");
        console.log(username);
        console.log(password);
        if (username) {
            const user = await db("users")
            .select()
            .where("username",username)
            .first();
            console.log("---------------------------",user);

            if (user && user.password === password) {
                req.user = user;
            }
        }
    }
    next();
}

async function isLoggedIn(req,res,next){
    req.user = req.user || req.session.user;
    if (req.user){
        next();
        return;
    } 
    res.status(401).send({message:"Unauthorized"});
}

async function isOwnerOfEpic(req,res,next){
    const epicId = Number(req.body.epic_id ? req.body.epic_id : req.params.id);

    const epic = await db("epics")
    .select("id","owner_id")
    .where({ id:epicId, owner_id: req.user.id, })
    .first();

    if(epic){
        next();
        return;
    }
    res.status(401).send({message: "acess denied epics"});
}

async function isOwnerOfCategory(req,res,next) {
    const categoryId = Number(req.body.category_id ? req.body.category_id : req.params.id);
    const isOwner = await db("categories")
    .leftJoin("epics","categories.epic_id", "=","epics.id")
    .select("epics.owner_id")
    .where({"categories.id": categoryId, "epics.owner_id": req.user.id})
    .first();

    if(isOwner) {
        next();
        return;
    }
    res.status(401).send({message:"access denied categories"});
}

async function isOwnerOfItem(req,res,next) {
    const itemId = req.params.id
    const isOwner = await db("items")
    .leftJoin("categories","items.category_id","=","categories.id")
    .leftJoin("epics","categories.epic_id","=","epics.id")
    .where({"items.id":itemId,"epics.owner_id":req.user.id})
    .first();

    if(isOwner){
        next();
        return;
    }
    res.status(401).send({message:"acces denied item"});
}

module.exports ={
    authorizeRequest, 
    authenticateUser: basicAuthenticateUser,
    isLoggedIn,
    isOwnerOfEpic,
    isOwnerOfCategory,
    isOwnerOfItem,
};