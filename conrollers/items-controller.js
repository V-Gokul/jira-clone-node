const express = require("express");
const { authenticateUser, isLoggedIn,
    isOwnerOfEpic,isOwnerOfCategory,
    isOwnerOfItem
} = require("../middleWare/auth");
const router = express.Router();
const itemsService = require("../services/items-services");

router.get("/",authenticateUser,isLoggedIn ,async(req,res)=>{
    const epicId = req.body.epic_id;
    res.send(await itemsService.getAllItems(req.user));
});

router.post("/",authenticateUser,isLoggedIn,isOwnerOfCategory,async(req,res)=>{
    const newItems = await itemsService.creatItems(req.body);
    if(!newItems){
        res.status(404).send({message:"Invalid Item data,"});
        return;
    }
    res.status(201).send(newItems);
})
router.get("/:id",authenticateUser,isLoggedIn,isOwnerOfItem,async(req,res)=>{
    const items = await itemsService.getItemById(Number(req.params.id));
    if(!items){
        res.status(404).send({message:"Item not found"});
        return;
    }
    res.send(items);
});
router.delete("/:id",authenticateUser,isLoggedIn,isOwnerOfItem,async (req,res)=>{
    const items = await itemsService.deleteItems(Number(req.params.id));
    if(items){
        res.status(404).send({message:"Item already deleted"});
        return;
       
    }

    res.send(items); 
});

router.put("/:id",authenticateUser,isLoggedIn,isOwnerOfItem,async (req,res)=>{
    const updateItem = await itemsService.updateItemById(Number(req.params.id),req.body);
    if (!updateItem){
        res.status(404).send({message:"Item not found,"});
        return;
    }
    res.send(updateItem);
});
module.exports = router;


