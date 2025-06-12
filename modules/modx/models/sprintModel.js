const Database = require("../db-connection");

const getAll = async () => {
  const sql = `SELECT * FROM MODX_SPRINT`;
  const binds = {};

  // db connection setup //
  const connection = await Database.getConnection();
  const result = await connection.execute(sql, binds, Database.getOptions());
  await connection.close();
  // db connection setup //
  return result.rows;
};

const create = async (data) => {
  const sql = `INSERT INTO MODX_SPRINT (SPRINT_NAME, START_DATE,END_DATE) VALUES (:SPRINT_NAME, :START_DATE, :END_DATE)`;
  const binds = {
    SPRINT_NAME: data.SPRINT_NAME,
    START_DATE: data.START_DATE,
    END_DATE: data.END_DATE,
  };

  // db connection setup //
  const connection = await Database.getConnection();
  const result = await connection.execute(sql, binds, Database.getOptions());
  await connection.commit();
  await connection.close();
  // db connection setup //
  return result.rows;
};

const find = async (id) => {
  const sql = `SELECT * FROM MODX_SPRINT WHERE SPRINT_ID = :SPRINT_ID`;
  const binds = {
    SPRINT_ID: id,
  };

  // db connection setup //
  const connection = await Database.getConnection();
  const result = await connection.execute(sql, binds, Database.getOptions());
  await connection.close();
  // db connection setup //
  return result.rows;
};

const update = async (id, data) => {
  const sql = `UPDATE MODX_SPRINT SET SPRINT_NAME = :SPRINT_NAME, START_DATE = :START_DATE, END_DATE = :END_DATE WHERE SPRINT_ID = :SPRINT_ID`;
  const binds = {
    SPRINT_ID: id,
    SPRINT_NAME: data.SPRINT_NAME,
    START_DATE: data.START_DATE,
    END_DATE: data.END_DATE,
  };

  // db connection setup //
  const connection = await Database.getConnection();
  const result = await connection.execute(sql, binds, Database.getOptions());
  await connection.commit();
  await connection.close();
  // db connection setup //
  return result.rows;
};

const remove = async (id) => {
  const sql = `DELETE FROM MODX_SPRINT WHERE SPRINT_ID = :SPRINT_ID`;
  const binds = {
    SPRINT_ID: id,
  };

  // db connection setup //
  const connection = await Database.getConnection();
  const result = await connection.execute(sql, binds, Database.getOptions());
  await connection.commit();
  await connection.close();
  // db connection setup //
  return result.rows;
};

module.exports = { getAll, create, find, update, remove };
