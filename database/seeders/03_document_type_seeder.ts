import { BaseSeeder } from '@adonisjs/lucid/seeders'
import DocumentType from '#models/document_type'
import { Status } from '#enums/status_enum'

export default class DocumentTypeSeeder extends BaseSeeder {
  async run() {
    const types = [
      {
        name: 'Documento de identidad',
        code: 'DNI',
        description: 'Documento nacional de identidad o pasaporte',
        requiresSignature: false,
        requiresExpiration: true,
        isMandatoryForClient: true,
        isMandatoryForTrainer: true,
        status: Status.ACTIVE,
      },
      {
        name: 'Contrato de membresía',
        code: 'CONTRATO_MEMBRESIA',
        description: 'Contrato de términos y condiciones de la membresía',
        requiresSignature: true,
        requiresExpiration: false,
        isMandatoryForClient: true,
        isMandatoryForTrainer: false,
        status: Status.ACTIVE,
      },
      {
        name: 'Consentimiento médico',
        code: 'CONSENTIMIENTO_MEDICO',
        description: 'Declaración de aptitud física y consentimiento para actividad deportiva',
        requiresSignature: true,
        requiresExpiration: true,
        isMandatoryForClient: true,
        isMandatoryForTrainer: false,
        status: Status.ACTIVE,
      },
      {
        name: 'Foto de perfil',
        code: 'FOTO_PERFIL',
        description: 'Fotografía de identificación del cliente',
        requiresSignature: false,
        requiresExpiration: false,
        isMandatoryForClient: false,
        isMandatoryForTrainer: false,
        status: Status.ACTIVE,
      },
      {
        name: 'Certificado médico',
        code: 'CERTIFICADO_MEDICO',
        description: 'Certificado médico de aptitud para actividad física',
        requiresSignature: false,
        requiresExpiration: true,
        isMandatoryForClient: false,
        isMandatoryForTrainer: true,
        status: Status.ACTIVE,
      },
      {
        name: 'Contrato de entrenador',
        code: 'CONTRATO_ENTRENADOR',
        description: 'Contrato laboral o de servicios del entrenador',
        requiresSignature: true,
        requiresExpiration: true,
        isMandatoryForClient: false,
        isMandatoryForTrainer: true,
        status: Status.ACTIVE,
      },
    ]

    for (const type of types) {
      await DocumentType.firstOrCreate({ code: type.code }, type)
    }
  }
}
