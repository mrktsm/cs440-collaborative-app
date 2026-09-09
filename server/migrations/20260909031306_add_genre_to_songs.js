/**
 * Adds a `genre` column to the main `songs` table.
 */
export async function up(knex) {
  const hasColumn = await knex.schema.hasColumn('songs', 'genre')
  if (!hasColumn) {
    await knex.schema.alterTable('songs', (table) => {
      table.string('genre', 60).nullable()
    })
  }
}

export async function down(knex) {
  const hasColumn = await knex.schema.hasColumn('songs', 'genre')
  if (hasColumn) {
    await knex.schema.alterTable('songs', (table) => {
      table.dropColumn('genre')
    })
  }
}