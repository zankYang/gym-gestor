import factory from '@adonisjs/lucid/factories'
import GymFile from '#models/file'

const STORAGE_PROVIDERS = ['local', 's3', 'gcs']
const MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf', 'image/webp']
const EXTENSIONS = ['jpg', 'png', 'pdf', 'webp']

export const FileFactory = factory
  .define(GymFile, ({ faker }) => {
    const mimeIdx = faker.number.int({ min: 0, max: MIME_TYPES.length - 1 })
    const originalName = faker.system.fileName()
    return {
      tenantId: 1,
      storageProvider: faker.helpers.arrayElement(STORAGE_PROVIDERS),
      bucketName: 'gym-gestor-files',
      objectKey: `uploads/${faker.string.uuid()}/${originalName}`,
      originalName,
      storedName: `${faker.string.uuid()}.${EXTENSIONS[mimeIdx]}`,
      mimeType: MIME_TYPES[mimeIdx],
      extension: EXTENSIONS[mimeIdx],
      sizeBytes: faker.number.int({ min: 1024, max: 5242880 }),
      checksum: faker.string.hexadecimal({ length: 64 }),
      visibility: 'private',
      uploadedBy: 1,
    }
  })
  .build()
