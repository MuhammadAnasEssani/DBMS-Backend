import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserAddresses extends BaseSchema {
  protected tableName = 'user_addresses'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name',20).notNullable()
      table.integer('mobile_number',20).notNullable()
      table.integer('pin_code',20).notNullable()
      table.string('locality',100).notNullable()
      table.string('address',255).notNullable()
      table.string('city',100).notNullable()
      table.string('state',100).notNullable()
      table.string('landmark',100).nullable()
      table.integer('alternate_phone',20).nullable()
      table.integer('address_type',10).notNullable()
      table.integer('user_id',10).unsigned().notNullable()
      table
        .foreign('user_id')
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
