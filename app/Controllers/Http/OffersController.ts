// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import {rules, schema} from "@ioc:Adonis/Core/Validator";
import Offer from "App/Models/Offer";
import Application from '@ioc:Adonis/Core/Application'
import Auth from "App/Models/Auth";

export default class OffersController {
  offerSchema = schema.create({
    title: schema.string({}, [
      rules.trim(),
      rules.maxLength(50),
      rules.unique({
        table: 'offers', column: 'title',
      }),
    ]),
    description: schema.string([rules.maxLength(65535),rules.trim()]),

    // avatar: schema.string.optional({}, [
    //   rules.maxLength(255)
    // ]),
    avatar: schema.file({
      // size: '2mb',
      // extnames: ['jpg', 'png'],
    }),
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
  public async getAllOffers({ response }) {
    try {

      const offers = await Offer
        .query()
      return response.status(200).json(this.apiResponse(true,'Offer Fetched successfully!',offers))
    }catch(error){
      response.status(400).json(this.apiResponse(false,JSON.stringify(error.messages) || error.message,))
    }
  }
  public async index({ response,auth }) {
    try {
      // const categories = await Category.all()
      const user: any = auth.use('api').user;
      if(user.role == Auth.ROLES.VENDOR){
        const offers = await Offer
          .query().where('created_by_id',user.id)
        return response.status(200).json(this.apiResponse(true,'Offer Fetched successfully!',offers))
      }
      const offers = await Offer
        .query()
      return response.status(200).json(this.apiResponse(true,'Offer Fetched successfully!',offers))
    }catch(error){
      response.status(400).json(this.apiResponse(false,JSON.stringify(error.messages) || error.message,))
    }
  }
  public async store({ request, response,auth }) {
    try {
      const user: any = auth.use('api').user;
      const payload: any = await request.validate({schema: this.offerSchema})
      await payload.avatar.move(Application.tmpPath('uploads/offer'))
      const data = {
        title: payload.title,
        description: payload.description,
        created_by_id: user.id,
        avatar: payload.avatar.fileName
      }
      const offer: Offer = await Offer.create(data)
      return response.status(201).json(this.apiResponse(true,'Offer Added successfully!',offer))
    }catch(error){
      response.status(400).json(this.apiResponse(false,JSON.stringify(error.messages) || error.message,))
    }
  }
  public async show({ params, response }) {
    try{
      const { id }: { id: Number } = params
      const offer: any = await Offer.find(id)
      if (!offer) {
        return response.notFound({ message: 'Offer not found' })
      }
      return response.ok(offer)
    }catch(error){
      response.badRequest(error.message)
    }
  }
  public async update({ request, params, response }) {
    try{
      const payload: any = await request.validate({ schema: this.offerSchema })
      const { id }: { id: Number } = params
      const offer: any = await Offer.find(id)
      if (!offer) {
        return response.notFound({ message: 'Offer not found' })
      }
      offer.title = payload.title
      offer.description = payload.description
      offer.avatar = payload.avatar
      offer.created_by_id = payload.created_by_id
      await offer.save()
      return response.ok(offer)
    }catch(error){
      response.badRequest(error.message)
    }
  }
  public async destroy({ params, response }) {
    try{
      const { id }: { id: Number } = params
      const offer: any = await Offer.find(id)
      if (!offer) {
        return response.status(400).json(this.apiResponse(false,"Offer not Found"))
      }
      await offer.delete()
      return response.status(204).json(this.apiResponse(true,'Offer Deleted successfully!',offer))
    }catch(error){
      response.status(400).json(this.apiResponse(false,JSON.stringify(error.messages) || error.message,))
    }
  }
}
