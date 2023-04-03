import EventEmitter from 'events'

export default class Migrator extends EventEmitter {
  defaultVersion
  constructor() {
    super()
    this.defaultVersion = 0

    //const migrations = opts.migrations || [];
    //// sort migrations by version
    //this.migrations = migrations.sort((a, b) => a.version - b.version);
    //// grab migration with highest version
    //const lastMigration = this.migrations.slice(-1)[0];
    //// use specified defaultVersion or highest migration version
    //this.defaultVersion =
    //  opts.defaultVersion || (lastMigration && lastMigration.version) || 0;
  }
  /**
   * Returns the initial state for the migrator
   *
   * @param {object} [data] - The data for the initial state
   * @returns {{meta: {version: number}, data: any}}
   */
  generateInitialState(data: any) {
    return {
      meta: {
        version: this.defaultVersion
      },
      data
    }
  }
}
