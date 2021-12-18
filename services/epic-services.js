const knex = require("../db");
// async function getAllEpics(user) {
//   const epics = await knex
//     .select({
//       id: "epics.id",
//       name: "epics.name",
//       created_at: "epics.created_at",
//       updated_at: "epics.updated_at",
//       owner_id: "epics.owner_id",
//       category_id: "categories.id",
//       category_name: "categories.name",
//       category_created_at: "categories.created_at",
//       category_updated_at: "categories.updated_at",
//     })
//     .from("epics")
//     .leftJoin("categori es", "categories.epic_id", "=", "epics.id")
//     .where("owner_id", user.id);

//   const results = [];
//   for (let epic of epics) {
//     const existing = results.find((resultEpic) => {
//       return resultEpic.id === epic.id;
//     });
//     if (existing) {
//       existing.categories.push({
//         id: epic.category_id,
//         name: epic.category_name,
//         created_at: epic.category_created_at,
//         updated_at: epic.category_updated_at,
//       });
//     } else {
//       const temp = {
//         id: epic.id,
//         name: epic.name,
//         created_at: epic.created_at,
//         updated_at: epic.updated_at,
//         owner_id: epic.owner_id,
//         categories: [],
//       };
//       if (epic.category_id) {
//         temp.categories.push({
//           id: epic.category_id,
//           name: epic.category_name,
//           created_at: epic.category_created_at,
//           updated_at: epic.category_updated_at,
//         });
//       }
//       results.push(temp);
//     }
//   }
//   return results;
// }
async function getAllEpics(user) {
  let epics = [];
  if (user.id) {
    epics = await knex("epics").select().where("owner_id", user.id);

    for (let epic of epics) {
      {
        epic.category = await knex ("categories")
        .select()
        .where("epic_id",epic.id);
      }
      for (let catag of epic.category) {
        epic.item = await knex("items")
        .select()
        .where("category_id",catag.id);
        console.log("items", catag.id);

      }
     
    }
    console.log("epics",epics);
    return epics;
  
  }
}

async function createEpic(epicName,user) {
  const newEpic = { name: epicName, created_at: new Date() ,owner_id:user.id};
  const insertedIds = await knex.insert(newEpic).into("epics");
  newEpic.id = insertedIds[0]; 
  return newEpic;
}

function getEpicById(epicId) {
  return knex.select("*").from("epics").where("id", epicId).first();
}

async function updateEpic(id, epicName) {
  const epic = await getEpicById(id);

  if (!epic) {
    return null;
  }

  await knex("epics")
    .update({ name: epicName, updated_at: new Date() })
    .where("id", id);

  return getEpicById(id);
}

async function deleteEpic(id) {
  const epic = await getEpicById(id);

  if (!epic) {
    return null;
  }

  await knex("epics").del().where("id", id);

  return epic;
}

module.exports = {
  getAllEpics,
  createEpic,
  updateEpic,
  getEpicById,
  deleteEpic,
};
// function getAllEpics(){
//     return knex.select("*").from("epics");
// }
//  async function createEpics(epicName) {
//      const newEpic = {name: epicName, created_at: new Date() };
//       // return knex.insert({ name : epicName });
//     const insertedIds = await knex.insert(newEpic).into("epics");
//     newEpic.id = insertedIds[0];
//     return newEpic;

// }

// async function getEpicById(epicId){
//     return knex.select("*").from("epics").where("id",epicId).first();
// }

// async function updateEpic(id,epicName) {
//     const epic = await getEpicById(id);

//     if(!epic){
//         return null;
//     }

//     await knex("epics")
//         .update({ name: epicName, updated_at: new Date() })
//         .where("id",id);

//         return getEpicById(id);

// }

// async function deleteEpic(id){
//     const epic = await getEpicById(id);

//     if(!epic){
//         return null;
//     }
//     await knex("epics").del().where("id",id);
//     return epic;
// }

// module.exports ={
//     getAllEpics,
//     createEpics,
//     updateEpic,
//     getEpicById,
//     deleteEpic
// };
