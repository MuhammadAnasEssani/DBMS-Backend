import { DateTime } from 'luxon'
import {BaseModel, column, ManyToMany, manyToMany} from '@ioc:Adonis/Lucid/Orm'
import Product from "App/Models/Product";

export default class Colour extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public colour: string

  @manyToMany(() => Product, {
    localKey: 'id',
    pivotForeignKey: 'colour_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'product_id',
  })
  public product: ManyToMany<typeof Product>

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime
}
