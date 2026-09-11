export async function up(knex) {
  return knex.schema.table('songs', (table) => {
    table.integer('release_year');
  });
}

export async function down(knex) {
  return knex.schema.table('songs', (table) => {
    table.dropColumn('release_year');
  });
}