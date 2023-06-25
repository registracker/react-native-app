import {format, subDays} from 'date-fns';
import {db} from '../config/database';

export const createTableIncidentes = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS tbl_incidente (
            id INTEGER,
            nombre TEXT, 
            icono TEXT
            );`,
      [],
      (sqlTxn, result) => {},
      error => {},
    );
  });
};

export const getIncidentesDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tbl_incidente;',
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

export const storeCatalogoIncidentes = incidentes => {
  const inserting_incidentes = incidentes.map(item => {
    return `(${item.id}, '${item.nombre}', '${item.icono}'),`;
  });
  const values = inserting_incidentes.join(' ');
  const sql = values.substring(0, values.length - 1);

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO tbl_incidente (id, nombre, icono) VALUES ${sql} ;`,
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

export const createTableReporteIncidentes = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS tbl_reporte_incidente (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            desplazamiento_id TEXT, 
            id_incidente INTEGER,
            nombre TEXT,
            icono TEXT,
            longitud TEXT, 
            latitud TEXT, 
            altitud TEXT, 
            fecha_reporte TEXT,
            enviado INTEGER DEFAULT 0
            );`,
      [],
      (sqlTxn, result) => {},
      error => {},
    );
  });
};

export const getReporteIncidentesDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tbl_reporte_incidente ORDER BY id DESC limit 15;',
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

export const storeReporteIncidente = data => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO tbl_reporte_incidente (desplazamiento_id, id_incidente, nombre, icono, longitud, latitud, altitud, fecha_reporte, enviado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);',
        [
          data.desplazamiento_id,
          data.id_incidente,
          data.nombre,
          data.icono,
          data.longitud,
          data.latitud,
          data.altitud,
          data.fecha_reporte,
          data.enviado || 0,
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

export const deleteReporteIncidente = id => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM tbl_reporte_incidente WHERE id = ?;',
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

export const enviarIncidenteDatabase = id => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE tbl_reporte_incidente
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

export const dropIncidentes = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `
                DELETE FROM tbl_incidente;
                `,
        [],
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

export const deleteReporteIncidentes = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM tbl_reporte_incidente;',
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

export const limpiarIncidenteTable = () => {
  const now = format(subDays(new Date(), 3), 'yyyy-MM-dd hh:mm:ss');
  db.transaction(tx => {
    tx.executeSql(
      'DELETE FROM tbl_reporte_incidente WHERE date(fecha_reporte) < date(?) AND enviado = 1',
      [now],
      (transaction, res) => {},
      error => {},
    );
  });
};

export const sincronizarIncidentesDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tbl_reporte_incidente WHERE enviado != 1',
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
