// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from "App/Models/Category";
import {rules, schema, validator} from '@ioc:Adonis/Core/Validator'

export default class CategoriesController {
  categorySchema = schema.create({
    name: schema.string({}, [
      rules.trim(),
      rules.maxLength(50)
    ]),
    parent_id: schema.number.optional()
  })
  public async index({ response }) {
    try {
      // const categories = await Category.all()
      const categories = await Category
        .query()
        .preload('product')
      return response.ok(categories)
    }catch(error){
      response.badRequest(error.message)
    }
  }
  public async store({ request, response }) {
    try {
      // const payload: any = await request.validate({schema: this.categorySchema})
      const payload = await validator.validate({
        schema: this.categorySchema,
        data: {
          name : 12
        },
        reporter: validator.reporters.api,
      })
      // return payload
      const category: Category = await Category.create(payload)
      return response.ok(category)
    }catch(error){
      response.badRequest(error.message)
    }
  }
  public async show({ params, response }) {
    try{
      const { id }: { id: Number } = params
      const category: any = await Category.find(id)
      if (!category) {
        return response.notFound({ message: 'Category not found' })
      }
      return response.ok(category)
    }catch(error){
      response.badRequest(error.message)
    }
  }
  public async update({ request, params, response }) {
    try{
      const payload: any = await request.validate({ schema: this.categorySchema })

      const { id }: { id: Number } = params

      const category: any = await Category.find(id)
      if (!category) {
        return response.notFound({ message: 'Category not found' })
      }

      category.name = payload.name
      category.parent_id = payload.parent_id

      await category.save()

      return response.ok(category)
    }catch(error){
      response.badRequest(error.message)
    }
  }
  public async destroy({ params, response }) {
    try{
      const { id }: { id: Number } = params
      const category: any = await Category.find(id)
      if (!category) {
        return response.notFound({ message: 'Category not found' })
      }
      await category.delete()
      return response.ok({ message: 'Category deleted successfully.' })
    }catch(error){
      response.badRequest(error.message)
    }
  }
}
