const oracledb = require("oracledb");
const { dbConfig } = require("../../libs/db/dbConfig");
class Database {
  static async getConnection() {
    const config = dbConfig("modx");
    return await oracledb.getConnection(config);
  }
  static getOptions() {
    return {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      fetchTypeHandler: function (metaData) {
        metaData.name = metaData.name
          .toLowerCase()
          .replace(/_(\w)/g, (m, p1) => p1.toUpperCase());
      },
    };
  }
}

module.exports = Database;
