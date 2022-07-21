import {DateTime} from 'luxon'
import {BaseModel, column, HasMany, hasMany, manyToMany, ManyToMany} from '@ioc:Adonis/Lucid/Orm'
import Category from "App/Models/Category";
import ProductPicture from "App/Models/ProductPicture";
import CartItem from "App/Models/CartItem";
import OrderItem from "App/Models/OrderItem";
import Colour from "App/Models/Colour";
import Offer from "App/Models/Offer";
import Size from "App/Models/Size";

export default class Product extends BaseModel {

  static  TYPE = {
    NORMAL : "10",
    FEATURES: "20"
  }
  static  REQUEST_TYPE = {
    FEATURED : 10,
    DISCOUNTED: 20,
    CATEGORY: 30,
    SHOP: 40,
    OFFER: 50
  }

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public price: number

  @column()
  public quantity: number

  @column()
  public description: string

  @column()
  public discount: number

  @column()
  public createdById: number

  @column()
  public type: number

  @column()
  public status: number

  @column()
  public updatedById: number

  @manyToMany(() => Category, {
    localKey: 'id',
    pivotForeignKey: 'product_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'category_id'
  })
  public category: ManyToMany<typeof Category>

  @manyToMany(() => Colour, {
    localKey: 'id',
    pivotForeignKey: 'product_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'colour_id',
  })
  public colour: ManyToMany<typeof Colour>

  @manyToMany(() => Offer, {
    localKey: 'id',
    pivotForeignKey: 'product_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'offer_id',
  })
  public offer: ManyToMany<typeof Offer>

  @manyToMany(() => Size, {
    localKey: 'id',
    pivotForeignKey: 'product_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'size_id',
    pivotTable: 'size_product'
  })
  public size: ManyToMany<typeof Size>

  @hasMany(() => ProductPicture, {
    foreignKey: 'product_id',
  })
  public pictures: HasMany<typeof ProductPicture>

  @hasMany(() => CartItem, {
    foreignKey: 'product_id', // defaults to userId
  })
  public cart_items: HasMany<typeof CartItem>

  @hasMany(() => OrderItem, {
    foreignKey: 'product_id', // defaults to userId
  })
  public order_items: HasMany<typeof OrderItem>

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime
}
