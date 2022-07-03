// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import {rules, schema} from "@ioc:Adonis/Core/Validator";
import Offer from "App/Models/Offer";
import Application from '@ioc:Adonis/Core/Application'

export default class OffersController {
  offerSchema = schema.create({
    title: schema.string({}, [
      rules.maxLength(50)
    ]),
    description: schema.string({}, [

    ]),
    // avatar: schema.string.optional({}, [
    //   rules.maxLength(255)
    // ]),
    created_by_id: schema.number(),
    avatar: schema.file({
      size: '2mb',
      extnames: ['jpg', 'png'],
    }),
  })
  public async index({ response }) {
    try {
      const offers = await Offer
        .query()
        .preload('product')
      return response.ok(offers)
    }catch(error){
      response.badRequest(error.messages)
    }
  }
  public async store({ request, response }) {
    try {
      const payload: any = await request.validate({schema: this.offerSchema})
      await payload.avatar.move(Application.tmpPath('uploads/offer'))
      const data = {
        title: payload.title,
        description: payload.description,
        created_by_id: payload.created_by_id,
        avatar: payload.avatar.fileName
      }
      const offer: Offer = await Offer.create(data)
      return response.ok(offer)
    }catch(error){
      response.badRequest(error.messages)
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
        return response.notFound({ message: 'Offer not found' })
      }
      await offer.delete()
      return response.ok({ message: 'Offer deleted successfully.' })
    }catch(error){
      response.badRequest(error.message)
    }
  }
}
