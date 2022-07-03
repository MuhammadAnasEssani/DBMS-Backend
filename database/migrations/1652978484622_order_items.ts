import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class OrderItems extends BaseSchema {
  protected tableName = 'order_items'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('product_vendor_id',10).unsigned().notNullable()
      table.integer('status',10).nullable().defaultTo(10)
      table.integer('product_id',10).unsigned().notNullable()
      table.integer('payable_price',10).notNullable()
      table.integer('purchased_qty',10).notNullable()
      table.integer('order_id',10).unsigned().notNullable()
      table
        .foreign('product_vendor_id')
        .references('auths.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table
        .foreign('product_id')
        .references('products.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table
        .foreign('order_id')
        .references('orders.id')
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
