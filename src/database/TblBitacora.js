import {db} from '../config/database';

export const createTableBitacora = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS tbl_bitacora (
        id INTEGER,
        tabla TEXT,
        fecha_actualizado TEXT
        );`,
      [],
      (sqlTxn, result) => {},
      error => {},
    );
  });
};

export const getBitacotaDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tbl_bitacora;',
        [],
        (transaction, res) => {
          resolve(res);
        },
        error => {
          reject(false);
        },
      );
    });
  });
};

export const getTableBitacotaDatabase = tabla => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tbl_bitacora WHERE tabla = ?;',
        [tabla],
        (transaction, res) => {
          resolve(res);
        },
        error => {
          console.log(
            '🚀 ~ file: TblBitacora.js:51 ~ returnnewPromise ~ error:',
            error,
          );
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

export const storeBitacoraDatabase = data => {
  const inserting_incidentes = data.map(item => {
    return `(${item.id}, '${item.nombre_tabla}', '${item.actualizado}'),`;
  });
  const values = inserting_incidentes.join(' ');
  const sql = values.substring(0, values.length - 1);

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO tbl_bitacora (id, tabla, fecha_actualizado) VALUES ${sql} ;`,
        [],
        (transaction, res) => {
          resolve(res);
        },
        error => {
          reject(false);
        },
      );
    });
  });
};
