/**
 * Create Artist table 
 * 
 * @author: Soikat
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('artists', (table) => {
    table.increments('id').primary()    
    table.string('name', 120).notNullable()
    table.text('bio')             
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists('artists')
}
