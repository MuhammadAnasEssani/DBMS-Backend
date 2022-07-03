import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Products extends BaseSchema {
  protected tableName = 'products'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name',50).notNullable()
      table.integer('price',10).notNullable()
      table.integer('quantity',10).notNullable()
      table.text('description').notNullable()
      table.integer('discount',10).nullable()
      table.integer('created_by_id',10).unsigned().notNullable()
      table.integer('type',10).notNullable()
      table.integer('status',10).nullable().defaultTo(10)
      // table.integer('category_id',10).unsigned().notNullable()
      // table.integer('offer_id',10).unsigned().nullable()
      table.integer('updated_by_id',10).unsigned().nullable()
      // table
      //   .foreign('offer_id')
      //   .references('offers.id')
      //   .onDelete('CASCADE')
      //   .onUpdate('CASCADE')
      // table
      //   .foreign('category_id')
      //   .references('categories.id')
      //   .onDelete('CASCADE')
      //   .onUpdate('CASCADE')
      table
        .foreign('created_by_id')
        .references('auths.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
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
