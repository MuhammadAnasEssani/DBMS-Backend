import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class OfferProducts extends BaseSchema {
  protected tableName = 'offer_product'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('product_id',10).unsigned().notNullable()
      table.integer('offer_id',10).unsigned().notNullable()
      table
        .foreign('offer_id')
        .references('offers.id')
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
