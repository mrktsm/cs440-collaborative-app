export async function up(knex) {
  await knex.schema.alterTable('songs', (table) => {
    table.integer('duration_seconds').unsigned().nullable()
  })
}

export async function down(knex) {
  await knex.schema.alterTable('songs', (table) => {
    table.dropColumn('duration_seconds')
  })
}
