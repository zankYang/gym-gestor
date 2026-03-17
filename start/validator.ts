/*
|--------------------------------------------------------------------------
| Validator file
|--------------------------------------------------------------------------
|
| The validator file is used for configuring global transforms for VineJS.
| The transform below converts all VineJS date outputs from JavaScript
| Date objects to Luxon DateTime instances, so that validated dates are
| ready to use with Lucid models and other parts of the app that expect
| Luxon DateTime.
|
*/

import { DateTime } from 'luxon'
import { VineDate } from '@vinejs/vine'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'

declare module '@vinejs/vine/types' {
  interface VineGlobalTransforms {
    date: DateTime
  }
}

vine.messagesProvider = new SimpleMessagesProvider(
  {
    'required': '{{ field }} es obligatorio',
    'email': 'El correo electrónico no es válido',
    'in': '{{ field }} no es válido',
    'database.exists': '{{ field }} no existe o no es válido',
    'sameAs': 'El valor no coincide, favor de verificar',
    'minLength': 'El valor de {{ field }} debe tener al menos {{ min }} caracteres',
    'enum': 'El valor de {{ field }} no es válido',
  },
  {
    gymId: 'Gimnasio',
    fullName: 'Nombre completo',
    email: 'Email',
    password: 'Contraseña',
    role: 'Rol',
    status: 'Estado',
    slug: 'Slug',
    name: 'Nombre',
  }
)

VineDate.transform((value) => DateTime.fromJSDate(value))
