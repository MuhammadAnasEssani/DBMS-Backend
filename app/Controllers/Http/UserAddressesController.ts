// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'


import UserAddress from "App/Models/UserAddress";
import {rules, schema} from "@ioc:Adonis/Core/Validator";

export default class UserAddressesController {
  userAddressSchema = schema.create({
    name: schema.string({ trim: true }, [
      rules.maxLength(20),
      rules.minLength(3)
    ]),
    mobile_number: schema.number(),
    pin_code: schema.number(),
    locality: schema.string({ trim: true }, [
      rules.maxLength(100),
      rules.minLength(3)
    ]),
    address: schema.string({ trim: true }, [
      rules.maxLength(255),
      rules.minLength(3)
    ]),
    city: schema.string({ trim: true }, [
      rules.maxLength(100),
      rules.minLength(3)
    ]),
    state: schema.string({ trim: true }, [
      rules.maxLength(100),
      rules.minLength(3)
    ]),
    landmark: schema.string.optional({ trim: true }, [
      rules.maxLength(100),
      rules.minLength(3)
    ]),
    alternate_phone: schema.number.optional(),
    address_type: schema.string({ trim: true }, [
      rules.maxLength(20),
      rules.minLength(3)
    ]),
    user_id: schema.number()
  })
  public async index({ response }) {
    try {
      const user_addresses = await UserAddress
      .query()
      .preload('orders')
      return response.ok(user_addresses)
    }catch(error){
      response.badRequest(error.message)
    }
  }
  public async store({ request, response }) {
    try {
      const payload: any = await request.validate({schema: this.userAddressSchema})
      const user_address: UserAddress = await UserAddress.create(payload)
      return response.ok(user_address)
    }catch(error){
      response.badRequest(error.messages)
    }
  }
  public async show({ params, response }) {
    try{
      const { id }: { id: Number } = params
      const user_address: any = await UserAddress.find(id)
      if (!user_address) {
        return response.notFound({ message: 'User Address not found' })
      }
      return response.ok(user_address)
    }catch(error){
      response.badRequest(error.message)
    }
  }
  public async update({ request, params, response }) {
    try{
      const payload: any = await request.validate({ schema: this.userAddressSchema })

      const { id }: { id: Number } = params

      const user_address: any = await UserAddress.find(id)
      if (!user_address) {
        return response.notFound({ message: 'User Address not found' })
      }

      user_address.name = payload.name
      user_address.mobile_number = payload.mobile_number
      user_address.pin_code = payload.pin_code
      user_address.locality = payload.locality
      user_address.address = payload.address
      user_address.city = payload.city
      user_address.state = payload.state
      user_address.landmark = payload.landmark
      user_address.alternate_phone = payload.alternate_phone
      user_address.address_type = payload.address_type
      user_address.user_id = payload.user_id


      await user_address.save()

      return response.ok(user_address)
    }catch(error){
      response.badRequest(error.message)
    }
  }
  public async destroy({ params, response }) {
    try{
      const { id }: { id: Number } = params
      const user_address: any = await UserAddress.find(id)
      if (!user_address) {
        return response.notFound({ message: 'User Address not found' })
      }
      await user_address.delete()
      return response.ok({ message: 'User Address deleted successfully.' })
    }catch(error){
      response.badRequest(error.message)
    }
  }
}
