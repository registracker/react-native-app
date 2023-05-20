import {db} from '../config/database';

export const createTableVehiculos = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS tbl_vehiculos (
            id INTEGER PRIMARY KEY,
            nombre TEXT, 
            );`,
      [],
      (sqlTxn, result) => {},
      error => {},
    );
  });
};

export const getVehiculosDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tbl_vehiculos;',
        [],
        (transaction, res) => {
          let len = res.rows.length;
          let result = [];

          if (len > 0) {
            result = res.rows.raw();
          }
          resolve(result);
        },
        () => {
          reject([]);
        },
      );
    });
  });
};

export const storeVehiculosDatabase = vehiculos => {
  const sql = vehiculos.substring(0, vehiculos.length - 1);

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO tbl_vehiculos (id, nombre) VALUES ${sql} ;`,
        [],
        (sqlTxn, result) => {
          resolve(result);
        },
        error => {
          reject(error);
        },
      );
    });
  });
};
