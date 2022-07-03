import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CategoryProducts extends BaseSchema {
  protected tableName = 'category_product'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('product_id',10).unsigned().notNullable()
      table.integer('category_id',10).unsigned().notNullable()
      table
        .foreign('category_id')
        .references('categories.id')
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
