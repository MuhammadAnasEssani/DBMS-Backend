// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import {rules, schema} from "@ioc:Adonis/Core/Validator";
import Auth from "App/Models/Auth";
import Application from "@ioc:Adonis/Core/Application";
import Hash from "@ioc:Adonis/Core/Hash";

export default class VendorAuthsController {
  vendorSchema = schema.create({
    first_name: schema.string( [
      rules.trim(),
      rules.maxLength(20),
      rules.minLength(3)
    ]),
    last_name: schema.string([
      rules.trim(),
      rules.maxLength(20),
      rules.minLength(3)
    ]),
    email: schema.string( [
      rules.trim(),
      rules.maxLength(50),
      rules.email(),
      rules.unique({ table: 'auths', column: 'email' })
    ]),
    password: schema.string( [
      rules.maxLength(15),
      rules.minLength(6)
    ]),
    shop_name: schema.string( [
      rules.trim(),
      rules.maxLength(50),
      rules.minLength(3),
      rules.unique({ table: 'auths', column: 'shop_name' })
    ]),
    shop_description: schema.string( [rules.maxLength(65535),rules.trim()]),
    shop_address: schema.string( [rules.maxLength(255),rules.trim()]),
    contact_number: schema.string( [rules.maxLength(20),rules.trim()]),
    avatar: schema.file({
      size: '2mb',
      extnames: ['jpg', 'png'],
    }),
  })
  loginSchema = schema.create({
    email: schema.string({ trim: true }, [
      rules.maxLength(50),
      rules.email(),
      rules.exists({
        table: 'auths',
        column: 'email'
      })
    ]),
    password: schema.string({}, [
      rules.maxLength(15),
      rules.minLength(6)
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
  public async getShops({ response }) {
    try {
      const shops = await Auth
        .query()
        .where('role',Auth.ROLES.VENDOR)
      return response.status(200).json(this.apiResponse(true,'Shops Fetched successfully!',shops))
    }catch(error){
      response.status(400).json(this.apiResponse(false,JSON.stringify(error.messages) || error.message,))
    }
  }
  public async show({ params, response }) {
    try{
      const { id }: { id: Number } = params
      const shop = await Auth
        .query()
        .where('role',Auth.ROLES.VENDOR).where('id',id).first()
      if (!shop) {
        return response.status(400).json(this.apiResponse(false,'Shop not found'))
      }
      return response.status(200).json(this.apiResponse(true,'Shop Fetched successfully!',shop))
    }catch(error){
      response.status(400).json(this.apiResponse(false,JSON.stringify(error.messages) || error.message,))
    }
  }
  public async store({ request, response }) {
    try {
      const payload: any = await request.validate({schema: this.vendorSchema})
      await payload.avatar.move(Application.tmpPath('uploads/shop'))
      const data = {
        ...payload,
        avatar: payload.avatar.fileName,
        role: Auth.ROLES.VENDOR
      }
      const user: Auth = await Auth.create(data)
      return response.status(201).json(this.apiResponse(true,'Vendor registered successfully!',user))
    }catch(error){
       response.status(400).json(this.apiResponse(false,JSON.stringify(error.messages) || error.message,))
      // return error.messages
    }
  }
  public async login({ request, response,auth }) {
    try{
      const payload: any = await request.validate({schema: this.loginSchema})
      const user: any = await  Auth.query().where('email', payload.email).whereNot('role',Auth.ROLES.USER).first()
      if(!user){
        return response.status(400).json(this.apiResponse(false,'User not found'))
      }
      const isPassword : boolean = await Hash.verify(user.password, payload.password)

      if (!isPassword) {
        return response.status(400).json(this.apiResponse(false,'Invalid Credentials'))
      }
      // if (user.status != "active") {
      //   return response.notFound({ message: 'Pending Account. Please Verify Your Email!' })
      // }
      let token = await auth.attempt(payload.email, payload.password, {
        expiresIn: '1d'
      })
      return response.status(200).json(this.apiResponse(true,'Login successfully!', {...token,user}))

    }catch(error){
      response.status(400).json(this.apiResponse(false,JSON.stringify(error.messages) || error.message,))
    }
  }
}
