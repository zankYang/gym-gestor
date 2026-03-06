import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'admin.list_gyms.index': { paramsTuple?: []; params?: {} }
    'admin.create_gym.store': { paramsTuple?: []; params?: {} }
    'admin.update_gym.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.destroy_gym.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.list_users.index': { paramsTuple?: []; params?: {} }
    'users.create_user.store': { paramsTuple?: []; params?: {} }
    'users.show_user.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.update_user.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.destroy_user.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'auth.access_token.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.destroy': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'admin.list_gyms.index': { paramsTuple?: []; params?: {} }
    'users.list_users.index': { paramsTuple?: []; params?: {} }
    'users.show_user.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'admin.list_gyms.index': { paramsTuple?: []; params?: {} }
    'users.list_users.index': { paramsTuple?: []; params?: {} }
    'users.show_user.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'admin.create_gym.store': { paramsTuple?: []; params?: {} }
    'users.create_user.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.destroy': { paramsTuple?: []; params?: {} }
  }
  PATCH: {
    'admin.update_gym.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.update_user.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'admin.destroy_gym.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.destroy_user.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}