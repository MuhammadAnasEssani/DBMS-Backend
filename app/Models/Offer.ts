import {DateTime} from 'luxon'
import {BaseModel, column, ManyToMany, manyToMany} from '@ioc:Adonis/Lucid/Orm'
import Product from "App/Models/Product";

export default class Offer extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public status: number

  @column()
  public avatar: string

  @column()
  public created_by_id: number

  @column()
  public updated_by_id: number

  @manyToMany(() => Product, {
    localKey: 'id',
    pivotForeignKey: 'offer_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'product_id'
  })
  public product: ManyToMany<typeof Product>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
