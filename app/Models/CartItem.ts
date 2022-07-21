import {DateTime} from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import Product from "App/Models/Product";

export default class CartItem extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public cart_id: number

  @column()
  public product_vendor_id: number

  @column()
  public productId: number

  @column()
  public qty: number
  @column()
  public payable_price: number
  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @belongsTo(() => Product)
  public product: BelongsTo<typeof Product>
}
