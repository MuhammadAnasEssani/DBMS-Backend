import {DateTime} from 'luxon'
import {BaseModel, column, HasMany, hasMany} from '@ioc:Adonis/Lucid/Orm'
import Order from "App/Models/Order";

export default class UserAddress extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public mobile_number: string

  @column()
  public pin_code: number


  @column()
  public address: string

  @column()
  public city: string

  @column()
  public state: string

  @column()
  public country: string

  @column()
  public user_id: number

  @hasMany(() => Order, {
    foreignKey: 'user_address_id', // defaults to userId
  })
  public orders: HasMany<typeof Order>

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime
}
