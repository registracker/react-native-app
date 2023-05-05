import {db} from '../config/database';

export const createTableReporteMarcador = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS tbl_reporte_marcador (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            codigo TEXT, 
            id_marcador INTEGER,
            nombre_marcador TEXT,
            icono TEXT,
            latitud TEXT,
            longitud TEXT,
            altitud TEXT, 
            comentario TEXT, 
            fecha_reporte TEXT,
            enviado INTEGER DEFAULT 0
            );`,
      [],
      (sqlTxn, result) => {},
      error => {},
    );
  });
};

export const getReporteMarcadorDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tbl_reporte_marcador ORDER BY id DESC limit 15;',
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

export const storeReporteMarcador = data => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO tbl_reporte_marcador (codigo, id_marcador, nombre_marcador, icono, latitud, longitud, altitud, comentario, fecha_reporte, enviado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
        [
          data.codigo,
          data.id_marcador,
          data.nombre,
          data.icono,
          data.latitud,
          data.longitud,
          data.altitud,
          data.comentario,
          data.fecha_reporte,
          data.enviado,
        ],
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

export const deleteReporteMarcador = id => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM tbl_reporte_marcador WHERE id = ?;',
        [id],
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

export const actualizarMarcador = id => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE tbl_reporte_marcador
                SET enviado = 1
                WHERE id = ?;`,
        [id],
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

export const getLevantamiento = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT codigo FROM tbl_reporte_marcador GROUP BY codigo',
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

export const removeReporteMarcador = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `DELETE FROM tbl_reporte_marcador;`,
        [],
        (sqlTxn, result) => {
          resolve(result)
        },
        error => {
          reject(error)
        },
      );
    });

  });
}