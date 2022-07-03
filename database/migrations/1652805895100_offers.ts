import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Offers extends BaseSchema {
  protected tableName = 'offers'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title',50).notNullable()
      table.text('description').notNullable()
      table.integer('status').nullable().defaultTo(10)
      table.string('avatar',50).nullable()
      table.integer('created_by_id',10).unsigned().notNullable()
      table
        .foreign('created_by_id')
        .references('auths.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table.integer('updated_by_id',10).unsigned().nullable()
      table
        .foreign('updated_by_id')
        .references('auths.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
