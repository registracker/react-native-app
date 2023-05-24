import {db} from '../config/database';

export const createTableReporteContador = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS tbl_reporte_contador (
            codigo TEXT,
            contador Text,
            enviado INTEGER DEFAULT 0
            );`,
      [],
      (sqlTxn, result) => {
        console.log('result', result);
      },
      error => {
        console.log(
          '🚀 ~ file: TblReporteContador.js:17 ~ createTableReporteMarcador ~ error:',
          error,
        );
      },
    );
  });
};

export const getReporteContadorDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT count(codigo), codigo FROM tbl_reporte_contador GROUP BY codigo',
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
          reject(false);
        },
      );
    });
  });
};

export const getReporteContadorCodigoDatabase = codigo => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tbl_reporte_contador WHERE codigo = ?',
        [codigo],
        (transaction, res) => {
          let len = res.rows.length;
          let result = [];

          if (len > 0) {
            result = res.rows.raw();
          }
          resolve(result);
        },
        () => {
          reject(false);
        },
      );
    });
  });
};

export const storeReporteContadorDatabase = datos => {
  const sql = createValues(datos);
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO tbl_reporte_contador (codigo, contador, enviado) VALUES ${sql}`,
        [],
        (transaction, res) => {
          let len = res.rows.length;
          let result = [];

          if (len > 0) {
            result = res.rows.raw();
          }
          resolve(result);
          console.log("🚀 ~ file: TblReporteContador.js:87 ~ returnnewPromise ~ result:", result)
        },
        err => {
          console.log(err);
          reject(false);
        },
      );
    });
  });
};

const createValues = data => {
  const inserting_incidentes = data.map(item => {
    return `('${item.codigo}', '${JSON.stringify(item)}', 0),`;
  });

  const items = inserting_incidentes.join(' ');
  const sql = items.substring(0, items.length - 1);
  return sql;
};
