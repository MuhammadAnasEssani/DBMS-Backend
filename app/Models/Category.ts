import {BaseModel, column, ManyToMany, manyToMany} from '@ioc:Adonis/Lucid/Orm'
import Product from "App/Models/Product";
import {DateTime} from "luxon";

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public createdById: number

  @column()
  public updatedById: number

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @manyToMany(() => Product, {
    localKey: 'id',
    pivotForeignKey: 'category_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'product_id',
  })
  public product: ManyToMany<typeof Product>

  // @beforeCreate()
  // public static async setCreator (category:Category,auth) {
  //   // const ctx: any = HttpContext.get()
  //   const user = auth.use('api').user
  //   category.createdById = user.id
  // }
}
