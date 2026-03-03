import { BaseTransformer } from '@adonisjs/core/transformers'
import type Gym from '#models/gym'

export default class GymTransformer extends BaseTransformer<Gym> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'name',
      'slug',
      'logoUrl',
      'primaryColor',
      'secondaryColor',
      'accentColor',
      'status',
      'createdAt',
      'updatedAt',
    ])
  }
}
