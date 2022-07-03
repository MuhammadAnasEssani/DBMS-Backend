import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CartItems extends BaseSchema {
  protected tableName = 'cart_items'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('cart_id',10).unsigned().notNullable()
      table.integer('product_vendor_id',10).unsigned().notNullable()
      table.integer('product_id',10).unsigned().notNullable()
      table.integer('qty',10).notNullable()
      table
        .foreign('cart_id')
        .references('carts.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
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
