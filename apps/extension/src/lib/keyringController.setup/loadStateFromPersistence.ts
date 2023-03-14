import swGlobal from '@/ext.scripts/sw/swGlobal'
import Migrator from '../Migrator'

const localStore = swGlobal.localStore
export const loadStateFromPersistence = async function () {
  // migrations
  const migrator = new Migrator()
  //  migrator.on('error', console.warn);
  // read from disk
  // first from preferred, async API:
  let versionedData = (await localStore.get()) || migrator.generateInitialState(swGlobal.initialState)
  //
  //  // check if somehow state is empty
  //  // this should never happen but new error reporting suggests that it has
  //  // for a small number of users
  //  // https://github.com/metamask/metamask-extension/issues/3919
  //  if (versionedData && !versionedData.data) {
  //    // unable to recover, clear state
  //    versionedData = migrator.generateInitialState(firstTimeState);
  //    sentry.captureMessage('MetaMask - Empty vault found - unable to recover');
  //  }
  //
  //  // report migration errors to sentry
  //  migrator.on('error', (err) => {
  //    // get vault structure without secrets
  //    const vaultStructure = getObjStructure(versionedData);
  //    sentry.captureException(err, {
  //      // "extra" key is required by Sentry
  //      extra: { vaultStructure },
  //    });
  //  });
  //
  //  // migrate data
  //  versionedData = await migrator.migrateData(versionedData);
  //  if (!versionedData) {
  //    throw new Error('MetaMask - migrator returned undefined');
  //  }
  // this initializes the meta/version data as a class variable to be used for future writes
  localStore.setMetadata(versionedData.meta)

  // write to disk
  localStore.set(versionedData.data)
  // return just the data
  return versionedData.data
}
