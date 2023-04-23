import emitter from '@lit-web3/core/src/emitter'

type Migration = Record<string, any>

export default class Migrator {
  defaultVersion
  migrations
  constructor({ migrations = <Migration[]>[], defaultVersion = 0 } = {}) {
    this.migrations = migrations.sort((a, b) => a.version - b.version)
    const lastMigration = this.migrations.slice(-1)[0]
    this.defaultVersion = defaultVersion || (lastMigration && lastMigration.version) || 0
  }

  migrateData = async (versionedData = this.generateInitialState()) => {
    const pendingMigrations = this.migrations.filter((migration) => migration.version > versionedData.meta.version)

    for (const migration of pendingMigrations) {
      try {
        const migratedData = await migration.migrate(versionedData)
        if (!migratedData.data) throw new Error('Migrator - migration returned empty data')
        if (migratedData.version !== undefined && migratedData.meta.version !== migration.version)
          throw new Error('Migrator - Migration did not update version number correctly')
        versionedData = migratedData
      } catch (err: any) {
        const originalErrorMessage = err.message
        err.message = `DOID Migration Error #${migration.version}: ${originalErrorMessage}`
        emitter.emit('migrator_error', err)
        return versionedData
      }
    }
    return versionedData
  }

  generateInitialState = (data?: any) => ({ data, meta: { version: this.defaultVersion } })
}
