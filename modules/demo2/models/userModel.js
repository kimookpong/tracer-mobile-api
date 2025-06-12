const Database = require("../db-connection");

const getAll = async () => {
  const sql = `SELECT 
        PERSON.PERSON_ID,
        COALESCE(PERSON.TITLE_NAME, '') || COALESCE(PERSON.FIRST_NAME, '') || ' ' || COALESCE(PERSON.LAST_NAME, '') AS FULLNAME_TH,
        PERSON.DIVISION_TH_NAME,
        PERSON.POSITION_TH_NAME
      FROM PBL_VPER_PERSON PERSON
      WHERE PERSON.DIVISION_ID = :id`;
  const binds = { id: 41 };

  // db connection setup //
  const connection = await Database.getConnection();
  const result = await connection.execute(sql, binds, Database.getOptions());
  await connection.close();
  // db connection setup //
  return result.rows;
};

const getFind = async (req) => {
  const sql = `SELECT 
        PERSON.PERSON_ID,
        COALESCE(PERSON.TITLE_NAME, '') || COALESCE(PERSON.FIRST_NAME, '') || ' ' || COALESCE(PERSON.LAST_NAME, '') AS FULLNAME_TH,
        PERSON.DIVISION_TH_NAME,
        PERSON.POSITION_TH_NAME
      FROM PBL_VPER_PERSON PERSON
      WHERE PERSON.DIVISION_ID = :id`;
  const binds = { id: req.params.id };

  // db connection setup //
  const connection = await Database.getConnection();
  const result = await connection.execute(sql, binds, Database.getOptions());
  await connection.close();
  // db connection setup //
  return result.rows;
};

const del = async (req) => {
  return req.params.id;

}

module.exports = { getAll, getFind ,del};
