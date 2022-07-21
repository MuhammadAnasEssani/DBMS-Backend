import {DateTime} from 'luxon'
import {BaseModel, belongsTo, BelongsTo, column, HasMany, hasMany} from '@ioc:Adonis/Lucid/Orm'
import OrderItem from "App/Models/OrderItem";
import UserAddress from "App/Models/UserAddress";
import Auth from "App/Models/Auth";

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
  @belongsTo(() => UserAddress,{
    foreignKey: 'user_address_id'
  })
  public address: BelongsTo<typeof UserAddress>

  @belongsTo(() => Auth,{
    foreignKey: 'user_id'
  })
  public user: BelongsTo<typeof Auth>

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime
}
