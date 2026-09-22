/**
 * Onil's table: a rating per song, linked back to the main `songs`
 * table via a foreign key.
 */
export async function up(knex) {
  const exists = await knex.schema.hasTable('song_ratings')
  if (!exists) {
    await knex.schema.createTable('song_ratings', (table) => {
      table.increments('id').primary()
      table
        .integer('song_id')
        .notNullable()
        .references('id')
        .inTable('songs')
        .onDelete('CASCADE')
      table.integer('rating').notNullable()
      table.string('reviewer_name', 120)
      table.timestamp('created_at').defaultTo(knex.fn.now())
    })
  }
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists('song_ratings')
}
