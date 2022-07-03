import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Orders extends BaseSchema {
  protected tableName = 'orders'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id',10).unsigned().notNullable()
      table.integer('payment_status',10).notNullable()
      table.integer('payment_type',10).notNullable()
      table.integer('order_status',10).nullable().defaultTo(10)
      table.integer('user_address_id',10).unsigned().notNullable()
      table
        .foreign('user_id')
        .references('auths.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table
        .foreign('user_address_id')
        .references('user_addresses.id')
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
