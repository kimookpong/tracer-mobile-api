function dbConfig(moduleName) {
  const module = moduleName.toUpperCase();
  return {
    user: process.env[`${module}_DB_USER`],
    password: process.env[`${module}_DB_PASSWORD`],
    connectString: process.env[`${module}_DB_CONNECTION_STRING`],
  };
}

module.exports = { dbConfig };
