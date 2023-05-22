import {db} from '../config/database';

export const createTableBitacora = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS tbl_bitacora (
        id INTEGER,
        tabla TEXT,
        fecha_creado TEXT
        );`,
      [],
      (sqlTxn, result) => {},
      error => {},
    );
  });
};

export const getBitacota = tabla => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tbl_bitacora WHERE tabla = ?;',
        [tabla],
        (transaction, res) => {
            console.log(res);
          resolve(res);
        },
        () => {
          reject(false);
        },
      );
    });
  });
};
export const actualizarBitacora = (tabla, fecha) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE tbl_bitacora SET fecha = ? WHERE tabla = ?;',
        [fecha, tabla],
        (transaction, res) => {
          resolve(res);
        },
        () => {
          reject(false);
        },
      );
    });
  });
};
