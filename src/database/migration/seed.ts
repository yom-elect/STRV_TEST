import path from 'path';
import { Seeder } from 'mongo-seeding';
import Logger from '../../core/Logger';
import { db } from '../../config';

const config = {
  database: {
    name: db.name,
  },
  dropDatabase: true,
};
const seeder = new Seeder(config);
const collections = seeder.readCollectionsFromPath(path.resolve('./data-import'), {
  transformers: [Seeder.Transformers.replaceDocumentIdWithUnderscoreId],
});

seeder
  .import(collections)
  .then(() => {
    Logger.info('Seeding done');
  })
  .catch((e: any) => {
    Logger.info('seeding error');
    Logger.error(e);
  });
