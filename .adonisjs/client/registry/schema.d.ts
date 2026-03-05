/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'admin.list_gyms.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/gyms'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/list_gyms_controller').default['index']>>>
    }
  }
  'admin.create_gym.store': {
    methods: ["POST"]
    pattern: '/api/admin/gyms'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/gym').createGymValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/gym').createGymValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/create_gym_controller').default['store']>>>
    }
  }
  'admin.update_gym.update': {
    methods: ["PATCH"]
    pattern: '/api/admin/gyms/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/gym').updateGymValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/gym').updateGymValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/update_gym_controller').default['update']>>>
    }
  }
  'admin.destroy_gym.destroy': {
    methods: ["DELETE"]
    pattern: '/api/admin/gyms/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/destroy_gym_controller').default['destroy']>>>
    }
  }
  'users.list_users.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/users'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/user/list_users_controller').default['index']>>>
    }
  }
  'users.create_user.store': {
    methods: ["POST"]
    pattern: '/api/users'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').createUserValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').createUserValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/user/create_user_controller').default['store']>>>
    }
  }
  'users.show_user.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/users/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/user/show_user_controller').default['show']>>>
    }
  }
  'users.update_user.update': {
    methods: ["PATCH"]
    pattern: '/api/users/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').updateUserValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/user').updateUserValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/user/update_user_controller').default['update']>>>
    }
  }
  'users.destroy_user.destroy': {
    methods: ["DELETE"]
    pattern: '/api/users/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/user/destroy_user_controller').default['destroy']>>>
    }
  }
  'auth.access_token.store': {
    methods: ["POST"]
    pattern: '/api/auth/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').loginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth/access_token_controller').default['store']>>>
    }
  }
  'auth.access_token.destroy': {
    methods: ["POST"]
    pattern: '/api/auth/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth/access_token_controller').default['destroy']>>>
    }
  }
  'auth.testing.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/auth/testing'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth/testing_controller').default['show']>>>
    }
  }
}
