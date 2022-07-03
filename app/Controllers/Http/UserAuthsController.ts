// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Auth from "App/Models/Auth";
import {rules, schema} from "@ioc:Adonis/Core/Validator";
import Hash from '@ioc:Adonis/Core/Hash'

// const jwt = require("jsonwebtoken");


export default class UserAuthsController {
  userSchema = schema.create({
    first_name: schema.string({ trim: true }, [
      rules.maxLength(20),
      rules.minLength(3)
    ]),
    last_name: schema.string({ trim: true }, [
      rules.maxLength(20),
      rules.minLength(3)
    ]),
    email: schema.string({ trim: true }, [
      rules.maxLength(50),
      rules.email(),
      rules.unique({ table: 'auths', column: 'email' })
    ]),
    password: schema.string({}, [
      rules.maxLength(15),
      rules.minLength(6)
    ])
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
  public async index({ response }) {
    try {
      const users = await Auth
        .query()
        .preload('products')
        .preload('offers')
        .preload('cart_items')
        .preload('user_addresses')
        .preload('cart_products')
        .preload('product_orders')
        .preload('orders')
      return response.ok(users)
    }catch(error){
      response.badRequest(error.message)
    }
  }
  public async store({ request, response }) {
    try {
      const payload: any = await request.validate({schema: this.userSchema})
      // const token = jwt.sign({email: request.requestBody.email}, "salt")
      const user: Auth = await Auth.create({
        ...payload
      })
      return response.ok(user)
    }catch(error){
      response.badRequest(error.message)
    }
  }
  public async show({ params, response }) {
    try{
      const { id }: { id: Number } = params
      const user: any = await Auth.find(id)
      if (!user) {
        return response.notFound({ message: 'User not found' })
      }

      return response.ok(user)
    }catch(error){
      response.badRequest(error.message)
    }
  }
  public async verify({ params, response }) {
    try{
      const { code }: { code: String } = params
      const user: any = await  Auth.findBy('confirmation_code', code)
      if (!user) {
        return response.notFound({ message: 'User not found' })
      }
      user.status = "active"
      user.confirmation_code = null
      await user.save()
      return response.ok({message: "User verified successfully"})
    }catch(error){
      response.badRequest(error.message)
    }
  }
  public async login({ request, response,auth }) {
    try{
      const payload: any = await request.validate({schema: this.loginSchema})
      const user: any = await  Auth.query().where('email', payload.email).where('role',Auth.ROLES.USER).first()
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
      return response.status(200).json(this.apiResponse(true,'Login successfully!', {token,user}))

    }catch(error){
      response.badRequest(error.messages || error.message)
    }
  }
  public async update({ request, params, response }) {
    try{
      const payload: any = await request.validate({ schema: this.userSchema })

      const { id }: { id: Number } = params

      const user: any = await Auth.find(id)
      if (!user) {
        return response.notFound({ message: 'User not found' })
      }

      user.first_name = payload.first_name
      user.last_name = payload.last_name
      user.email = payload.email
      user.password = payload.password

      await user.save()

      return response.ok(user)
    }catch(error){
      response.badRequest(error.message)
    }
  }
  public async destroy({ params, response }) {
    try{
      const { id }: { id: Number } = params

      const user: any = await Auth.find(id)
      if (!user) {
        return response.notFound({ message: 'User not found' })
      }

      await user.delete()

      return response.ok({ message: 'User deleted successfully.' })
    }catch(error){
      response.badRequest(error.message)
    }
  }
}
