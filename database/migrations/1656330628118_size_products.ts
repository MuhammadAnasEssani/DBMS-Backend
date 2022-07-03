import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class SizeProducts extends BaseSchema {
  protected tableName = 'size_product'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('size_id',10).unsigned().notNullable()
      table.integer('product_id',10).unsigned().notNullable()
      table
        .foreign('product_id')
        .references('products.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table
        .foreign('size_id')
        .references('sizes.id')
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
