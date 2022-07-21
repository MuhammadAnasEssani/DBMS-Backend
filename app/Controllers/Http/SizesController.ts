// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import {rules, schema} from "@ioc:Adonis/Core/Validator";
import Size from "App/Models/Size";

export default class SizesController {
  sizeSchema = schema.create({
    size: schema.string({}, [
      rules.maxLength(50)
    ])
  })
  apiResponse(status,message: string, data?: any) {
    /*
    * Standard Structured api output
    * */
    return {
      status: status,
      message,
      // data: data ? typeof data.toJSON != 'undefined' ? data.toJSON() : data : null
      data: data || null,
    }
  }
  public async index({ response }) {
    try {
      const sizes = await Size
        .query()
      return response.status(200).json(this.apiResponse(true,'Sizes Fetched successfully!',sizes))
    }catch(error){
      response.status(400).json(this.apiResponse(false,JSON.stringify(error.messages) || error.message,))
    }
  }
  public async store({ request, response }) {
    try {
      const payload: any = await request.validate({schema: this.sizeSchema})
      const size: Size = await Size.create(payload)
      return response.ok(size)
    }catch(error){
      response.badRequest(error.message)
    }
  }
  public async show({ params, response }) {
    try{
      const { id }: { id: Number } = params
      const size: any = await Size.find(id)
      if (!size) {
        return response.notFound({ message: 'Size not found' })
      }
      return response.ok(size)
    }catch(error){
      response.badRequest(error.message)
    }
  }
  public async update({ request, params, response }) {
    try{
      const payload: any = await request.validate({ schema: this.sizeSchema })
      const { id }: { id: Number } = params
      const size: any = await Size.find(id)
      if (!size) {
        return response.notFound({ message: 'Size not found' })
      }
      size.size = payload.size
      await size.save()
      return response.ok(size)
    }catch(error){
      response.badRequest(error.message)
    }
  }
  public async destroy({ params, response }) {
    try{
      const { id }: { id: Number } = params
      const size: any = await Size.find(id)
      if (!size) {
        return response.notFound({ message: 'Size not found' })
      }
      await size.delete()
      return response.ok({ message: 'Size deleted successfully.' })
    }catch(error){
      response.badRequest(error.message)
    }
  }
}
