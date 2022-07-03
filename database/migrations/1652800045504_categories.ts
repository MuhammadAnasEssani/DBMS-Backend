import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Categories extends BaseSchema {
  protected tableName = 'categories'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name',50).unique().notNullable()
      table.text('description').notNullable()
      table.integer('created_by_id',10).unsigned().notNullable()
      table.integer('updated_by_id',10).unsigned().nullable()
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
      // table.integer('parent_id',10).unsigned().nullable()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      // table
      //   .foreign('parent_id')
      //   .references('categories.id')
      //   .onDelete('CASCADE')
      //   .onUpdate('CASCADE')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
    // this.schema.table(this.tableName, (table) => {
    //   table
    //     .foreign('parent_id')
    //     .references('categories.id')
    //     .onDelete('CASCADE')
    //     .onUpdate('CASCADE')
    // })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
