
exports.up = function(knex) {
   return  knex.schema.createTable("items", function (table) {
        table.increments();
        table.string("name").notNullable();
        table.timestamps();

        table.integer("category_id").unsigned().notNullable().references("categories.id");
      });
};

exports.down = function(knex) {
    return  knex.schema.dropTableIfExists("items");
};
