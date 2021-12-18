const knex = require("../db");
const epicsService = require('./epic-services')

// async function queryCategories(condition){
//     let categories;
//     if(!condition){
//         categories = await knex("categories").select();
//     } else{
//         categories = await knex("categories").select().where(condition);
//     }
//     for(category of categories){
//         category.epics = await knex("epics").select().where("id",category.epic_id).first();
//         category.items = await knex("items").select().where("category_id",category.id);
//     }
//     return categories;
// }

//  async function getAllCategories(user){
// return await queryCategories();
// }


// async function getCategoryById(id){
//     // return knex("categories").select("*").where("id",id).first();
//     const category = await queryCategories({"categories.id":id});
//     if(!category){
//         return null;
//     }
//     return category;
    
// }

async function getAllCategories(user){
    const categories = await knex("categories ")
    .select("categories.*")
    .leftJoin("epics", "epics.id", "=", "categories.epic_id")
    .where("epics.owner_id", user.id);

    for(let category of categories) {
        category.epic = await epicsService.getEpicById(category.epic_id)
        category.items = await knex("items")
        .select()
        .where({"category_id":category.id});
    }
    return categories;
}

async function createCategory(category){
    const epicId = category.epic_id;
    const epic = await epicsService.getEpicById(epicId);

    if(!epic){
        return null;
    }

    category.created_at = new Date();
    category.updated_at = new Date();

    const [id] = await knex("categories").insert(category);
    category.id = id;
    return category;
}

function getCategoryById(id) {
    return knex("categories").select("*").where("id",id).first();
}



async function updateCategoryById(id, categoryInput){
    const category = await getCategoryById(id);

    if(!category){
        return null;
    }

    categoryInput.updated_at = new Date();
    // await knex("categories").update("name",categoryInput).where("id",id)
    await knex("categories").update(categoryInput).where("id",id)
    return getCategoryById(id);
}


async function deleteCategory(id){
    const category = await getCategoryById(id);
    if(!category){
        return null;
    }

    // await knex("categories").del().where("id",id);
    // return category;
    const itemIds = (
        await knex("items").select("id").where("category_id", id)
      ).map((item) => item.id);
    
      await knex("items").del().whereIn("id", itemIds);
    
      await knex("categories").del().where("id", id);
    
      return category;


}

module.exports ={
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategoryById,
    deleteCategory
}; 
