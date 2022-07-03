import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Auth from "App/Models/Auth";

export default class Roles {
  public async handle({auth,response}: HttpContextContract, next: () => Promise<void>, roles) {
    let user:any = auth.user
    let exists  =  await Auth.query().whereIn('role', roles).where('id', user.id).first()
    if(!exists){
      // throw new E
      return response.status(400).json({ message: 'Permission Denied' })
    }
    await next()
  }
}
