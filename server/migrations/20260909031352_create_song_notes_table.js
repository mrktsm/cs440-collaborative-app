/**
 * Kris's table: one short note per song, linked back to the main
 * `songs` table via a foreign key.
 */
export async function up(knex) {
  const exists = await knex.schema.hasTable('song_notes')
  if (!exists) {
    await knex.schema.createTable('song_notes', (table) => {
      table.increments('id').primary()
      table
        .integer('song_id')
        .notNullable()
        .references('id')
        .inTable('songs')
        .onDelete('CASCADE')
      table.text('note').notNullable()
      table.timestamp('created_at').defaultTo(knex.fn.now())
    })
  }
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('song_notes')
}