export async function up(knex) {
  await knex.schema.createTable('sunny_playlist_entries', (table) => {
    table.increments('id').primary()
    table.integer('song_id').notNullable().unique()
      .references('id').inTable('songs').onDelete('CASCADE')
    table.string('playlist_name', 120).notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

export async function down(knex) {
  await knex.schema.dropTable('sunny_playlist_entries')
}
