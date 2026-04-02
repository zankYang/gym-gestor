import { DateTime } from 'luxon'
import { UserSchema } from '#database/schema'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import hash from '@adonisjs/core/services/hash'
import { beforeSave, belongsTo, column, computed, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import Tenant from '#models/tenant'
import Role from '#models/role'
import Branch from '#models/branch'
import Attendance from '#models/attendance'
import AttendanceEvent from '#models/attendance_event'
import { AuthException } from '#exceptions/auth_exceptions'
import { RoleCode } from '#enums/role_enum'

export default class User extends UserSchema {
  static notDeleted(): ModelQueryBuilderContract<typeof User, User> {
    return this.query().whereNull('deleted_at')
  }

  async softDelete(): Promise<void> {
    this.deletedAt = DateTime.utc()
    await this.save()
  }

  private static _verifyCredentials = async (email: string, password: string, tenantId: number) => {
    const user = await User.notDeleted().where('email', email).preload('role').first()
    if (!user) {
      throw new AuthException()
    }
    const roleCode = user.role.code
    if (roleCode !== RoleCode.SUPERADMIN) {
      if (user.tenantId !== tenantId) {
        throw new AuthException()
      }
    }
    const isPasswordValid = await hash.verify(user.passwordHash, password)
    if (!isPasswordValid) {
      throw new AuthException()
    }
    return user
  }
  public static get verifyCredentials() {
    return User._verifyCredentials
  }
  public static set verifyCredentials(value) {
    User._verifyCredentials = value
  }

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.passwordHash) {
      user.passwordHash = await hash.make(user.passwordHash)
    }
  }

  @computed()
  public get allPermissions(): string[] {
    return this.role?.permissions?.map((p) => p.code) ?? []
  }

  static accessTokens = DbAccessTokensProvider.forModel(User)

  @column({ serializeAs: null })
  declare passwordHash: string

  @belongsTo(() => Tenant)
  declare tenant: BelongsTo<typeof Tenant>

  @belongsTo(() => Role)
  declare role: BelongsTo<typeof Role>

  @belongsTo(() => Branch)
  declare branch: BelongsTo<typeof Branch>

  @hasMany(() => Attendance, { foreignKey: 'registeredBy' })
  declare attendancesRegistered: HasMany<typeof Attendance>

  @hasMany(() => AttendanceEvent, { foreignKey: 'registeredBy' })
  declare attendanceEventsRegistered: HasMany<typeof AttendanceEvent>
}
