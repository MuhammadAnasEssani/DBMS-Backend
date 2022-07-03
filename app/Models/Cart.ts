import { DateTime } from 'luxon'
import {BaseModel, column, HasMany, hasMany} from '@ioc:Adonis/Lucid/Orm'
import CartItem from "App/Models/CartItem";

export default class Cart extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @hasMany(() => CartItem, {
    foreignKey: 'cart_id', // defaults to userId
  })
  public cart_items: HasMany<typeof CartItem>

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime
}
