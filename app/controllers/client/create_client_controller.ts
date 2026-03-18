import type { HttpContext } from '@adonisjs/core/http'
import { createClientValidator } from '#validators/client'
import Client from '#models/client'
import { Status } from '#enums/status_enum'
import { RoleCode } from '#enums/role_enum'

export default class CreateClientController {
  async store({ auth, request, response }: HttpContext) {
    const payload = await request.validateUsing(createClientValidator)
    const currentUser = auth.getUserOrFail()

    await currentUser.load((preloader) => preloader.load('role'))
    const currentRole = currentUser.role.code

    const targetTenantId =
      currentRole === RoleCode.SUPERADMIN ? payload.tenantId : currentUser.tenantId

    const client = await Client.create({
      tenantId: targetTenantId!,
      branchId: payload.branchId ?? null,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email ?? null,
      phone: payload.phone,
      gender: payload.gender ?? null,
      birthDate: payload.birthDate ?? null,
      emergencyContactName: payload.emergencyContactName ?? null,
      emergencyContactPhone: payload.emergencyContactPhone ?? null,
      medicalNotes: payload.medicalNotes ?? null,
      notes: payload.notes ?? null,
      status: payload.status ?? Status.ACTIVE,
      createdBy: currentUser.id,
      updatedBy: null,
    })

    return response.status(201).send({
      message: 'Cliente creado correctamente',
      data: client,
    })
  }
}
