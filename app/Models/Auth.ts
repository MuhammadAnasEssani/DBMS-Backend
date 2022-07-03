import {DateTime} from 'luxon'
import {BaseModel, beforeSave, column, HasMany, hasMany, HasManyThrough, hasManyThrough} from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Product from "App/Models/Product";
import Offer from "App/Models/Offer";
import CartItem from "App/Models/CartItem";
import Cart from "App/Models/Cart";
import UserAddress from "App/Models/UserAddress";
import OrderItem from "App/Models/OrderItem";
import Order from "App/Models/Order";

export default class Auth extends BaseModel {

  // protected tableName = 'users'
  static  ROLES = {
    USER : 10,
    VENDOR : 20,
    ADMIN: 30
  }

  @column({ isPrimary: true })
  public id: number

  @column()
  public first_name: string

  @column()
  public last_name: string

  @column()
  public email: string

  @column()
  public password: string

  @column()
  public role: number

  @column()
  public status: number

  @column()
  public confirmation_code: string

  @column()
  public shop_name: string

  @column()
  public shop_description: string

  @column()
  public shop_address: string

  @column()
  public contact_number: string

  @column()
  public avatar: string

  @hasMany(() => Product, {
    foreignKey: 'created_by_id', // defaults to userId
  })
  public products: HasMany<typeof Product>

  @hasMany(() => Offer, {
    foreignKey: 'created_by_id', // defaults to userId
  })
  public offers: HasMany<typeof Offer>

  @hasMany(() => CartItem, {
    foreignKey: 'product_vendor_id', // defaults to userId
  })
  public cart_products: HasMany<typeof CartItem>

  @hasMany(() => UserAddress, {
    foreignKey: 'user_id', // defaults to userId
  })
  public user_addresses: HasMany<typeof UserAddress>

  @hasManyThrough([() => CartItem, () => Cart],{
    localKey: 'id',
    foreignKey: 'user_id',
    throughLocalKey: 'id',
    throughForeignKey: 'cart_id',
  })
  public cart_items: HasManyThrough<typeof CartItem>

  @hasMany(() => OrderItem, {
    foreignKey: 'product_vendor_id', // defaults to userId
  })
  public product_orders: HasMany<typeof OrderItem>

  @hasMany(() => Order, {
    foreignKey: 'user_id', // defaults to userId
  })
  public orders: HasMany<typeof Order>

  @beforeSave()
  public static async hashPassword(user: Auth) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime
}
