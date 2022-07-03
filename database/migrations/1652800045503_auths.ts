import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Auths extends BaseSchema {
  protected tableName = 'auths'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('first_name',20).notNullable()
      table.string('last_name',20).notNullable()
      table.string('email',50).unique().notNullable()
      table.string('password',255).notNullable()
      table.integer('role').nullable().defaultTo(10)
      table.integer('status').nullable().defaultTo(10)
      table.string('shop_name',50).unique().nullable()
      table.text('shop_description').nullable()
      table.string('shop_address',255).nullable()
      table.string('contact_number',20).nullable()
      table.string('avatar',255).nullable()
      table.string('remember_me_token').nullable()
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
