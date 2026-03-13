import { Exception } from '@adonisjs/core/exceptions'

export class AuthException extends Exception {
  constructor() {
    super('El correo o la contraseña son incorrectos', {
      status: 401,
      code: 'E_INVALID_CREDENTIALS',
    })
  }
}
