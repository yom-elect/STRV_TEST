function seed(dbName, user, password) {
  // Used to return another database without modifying the db variable in the shell environment.
  // alternative to USE <database> Helper
  db = db.getSiblingDB(dbName);
  db.createUser({
    user: user,
    pwd: password,
    roles: [{ role: 'readWrite', db: dbName }],
  });

  db.createCollection('api_keys');
  db.createCollection('roles');

  db.api_keys.insert({
    metadata: 'To be used by the strv vendor',
    key: 'GCMUDiuY5a7WvyUNt9n3QztToSHzK7Uj',
    version: 1,
    status: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  db.roles.insertMany([
    { code: 'USER', status: true, createdAt: new Date(), updatedAt: new Date() },
    { code: 'ADMIN', status: true, createdAt: new Date(), updatedAt: new Date() },
  ]);
}

seed('strv-db', 'strv-db-user', 'changeit');
seed('strv-test-db', 'strv-test-db-user', 'changeit');
