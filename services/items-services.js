const knex = require("../db");
const {getCategoryById} = require("./categories-services");
const {getAllEpics} = require("./epic-services")

async function getAllItems(user){
    let items =[];
    if(user.id){
        items = await knex("items")
        .select("items.*")
        .leftJoin("categories","items.category_id","=","categories.id")
        .leftJoin("epics","categories.epic_id","=","epics.id")
        .where("epics.owner_id",user.id);
        // console.log(items,"items");
    }else{
        items = await knex("items").select();
    }

    for(let item of items){
        item.category = await getCategoryById(item.category_id);
        // console.log("item.c",item.category);
        item.epics = await knex("items").select()
        .where("id",item.category.epic_id);
        // console.log("item.e",item.epics)
    }
    return items;
}
async function creatItems(itemName){
    const newItem = itemName.category_id;
    const item = await getCategoryById(newItem);

    if(!item){
        return null;
    }
    itemName.created_at = new Date();
    itemName.updated_at = new Date();

    const [id] = await knex("items").insert(itemName);
    itemName.id = id;

    return itemName;  
}

async function getItemById(id){
    return knex("items").select("*").where("id",id).first();
}

async function updateItemById(id,itemInput){
    const itemIp = await getItemById(id);

    if(!itemIp){
        return null;
    }

    if (itemInput.category_id){
        const category = await getCategoryById(itemInput.category_id);

        if (!category) {
            return null;
        }
    }
    itemInput.updated_at = new Date();

    console.log(itemInput);
    // await knex("items").update(itemInput).where("id",id);
    await knex("items").where({id}).update(itemInput);
    return getItemById(id);
}

async function deleteItems(id){
    const items = await getItemById(id);
    if(!items){
        return null;
    }
    // await knex("items").del().where("id",id);
    await knex("items").where({ id }).del();
    return items;
}

module.exports ={
    getAllItems,
    creatItems,
    getItemById,
    updateItemById,
    deleteItems
}
