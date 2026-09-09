/**
 * Alters songs table: add an "album" attribute
 * 
 * @author Soikat
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  const hasColumn = await knex.schema.hasColumn('songs', 'album')
  if (!hasColumn) {
    await knex.schema.alterTable('songs', (table) => {
      table.string('album', 120).nullable()
    })
  }
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  const hasColumn = await knex.schema.hasColumn('songs', 'album')
  if (hasColumn) {
    await knex.schema.alterTable('songs', (table) => {
      table.dropColumn('album')
    })
  }
}
