const commandsMetaData = [
  {
    commandName: 'create:superadmin',
    description: 'Crear un usuario con rol superadmin (solo para uso inicial o recuperación)',
    help: '',
    namespace: 'create',
    aliases: [],
    args: [],
    flags: [
      {
        name: 'email',
        flagName: 'email',
        required: false,
        type: 'string',
        description: 'Email del superadmin',
      },
      {
        name: 'fullName',
        flagName: 'full-name',
        required: false,
        type: 'string',
        description: 'Nombre completo',
      },
      {
        name: 'password',
        flagName: 'password',
        required: false,
        type: 'string',
        description: 'Contraseña (mínimo 8 caracteres)',
      },
    ],
    options: { startApp: true },
  },
]

export async function getMetaData() {
  return commandsMetaData
}

export async function getCommand(metaData: { commandName: string }) {
  if (metaData.commandName === 'create:superadmin') {
    const { default: CreateSuperadmin } = await import('./create_superadmin.js')
    return CreateSuperadmin
  }
  return null
}
