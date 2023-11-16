const connection = require("../configs/connection");

const getData = (tableNames) => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM ${tableNames}`, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
const getDataById = (id, tableNames) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM ${tableNames} WHERE id = ${id}`;
    connection.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
const createData = (data) => {
  return new Promise((resolve, reject) => {
    const keys = Object.keys(data);
    const values = keys.map((key) => data[key]);
    const placeholders = keys.map(() => "?").join(", ");
    const query = `INSERT INTO books (${keys.join(
      ", "
    )}) VALUES (${placeholders})`;

    connection.query(query, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
const updateData = (id, data, tableName) => {
  return new Promise((resolve, reject) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const updateValues = keys.map((key) => `${key} = ?`).join(", ");
    const query = `UPDATE ${tableName} SET ${updateValues} WHERE id = ?`;

    connection.query(query, [...values, id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
const deleteData = (id, tableName) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `DELETE FROM ${tableName} WHERE id = ${id}`,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};
module.exports = { getData, getDataById, createData, updateData, deleteData };
