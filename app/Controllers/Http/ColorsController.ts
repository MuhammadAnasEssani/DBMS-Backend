// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Colour from "App/Models/Colour";
import {rules, schema} from "@ioc:Adonis/Core/Validator";

export default class ColorsController {
  colourSchema = schema.create({
    colour: schema.string({}, [
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
      const colours = await Colour
        .query()
      return response.status(200).json(this.apiResponse(true,'Colour Fetched successfully!',colours))
    }catch(error){
      response.status(400).json(this.apiResponse(false,JSON.stringify(error.messages) || error.message,))
    }
  }
  public async store({ request, response }) {
    try {
      const payload: any = await request.validate({schema: this.colourSchema})
      const colour: Colour = await Colour.create(payload)
      return response.ok(colour)
    }catch(error){
      response.badRequest(error.message)
    }
  }
  public async show({ params, response }) {
    try{
      const { id }: { id: Number } = params
      const colour: any = await Colour.find(id)
      if (!colour) {
        return response.notFound({ message: 'Colour not found' })
      }
      return response.ok(colour)
    }catch(error){
      response.badRequest(error.message)
    }
  }
  public async update({ request, params, response }) {
    try{
      const payload: any = await request.validate({ schema: this.colourSchema })
      const { id }: { id: Number } = params
      const colour: any = await Colour.find(id)
      if (!colour) {
        return response.notFound({ message: 'Colour not found' })
      }
      colour.colour = payload.colour
      await colour.save()
      return response.ok(colour)
    }catch(error){
      response.badRequest(error.message)
    }
  }
  public async destroy({ params, response }) {
    try{
      const { id }: { id: Number } = params
      const colour: any = await Colour.find(id)
      if (!colour) {
        return response.notFound({ message: 'Colour not found' })
      }
      await colour.delete()
      return response.ok({ message: 'Colour deleted successfully.' })
    }catch(error){
      response.badRequest(error.message)
    }
  }
}
