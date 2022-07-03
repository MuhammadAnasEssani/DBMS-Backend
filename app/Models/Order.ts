import {DateTime} from 'luxon'
import {BaseModel, column, HasMany, hasMany} from '@ioc:Adonis/Lucid/Orm'
import OrderItem from "App/Models/OrderItem";

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column()
  public payment_status: number

  @column()
  public payment_type: number

  @column()
  public order_status: number

  @column()
  public user_address_id: number

  @hasMany(() => OrderItem, {
    foreignKey: 'order_id', // defaults to userId
  })
  public order_items: HasMany<typeof OrderItem>

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime
}
