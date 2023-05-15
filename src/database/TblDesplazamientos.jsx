import { format, subDays } from 'date-fns';
import { db } from '../config/database';

export const createTableDesplazamiento = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS tbl_desplazamiento (
        uuid TEXT PRIMARY KEY,
        desplazamiento TEXT,
        costos TEXT,
        enviado INTEGER,
        activo INTEGER,
        fecha_registro TEXT
        );`,
      [],
      (sqlTxn, result) => {
      },
      error => {
      },
    );
  });
};

export const addItemDesplazamiento = (data) => {
  if (!data) {
    alert('Enter Data');
    return;
  }

  const registro = {
    ...data,
    desplazamiento: JSON.stringify(data.desplazamiento, null),
    costos: JSON.stringify(data.costos, null),
    fecha_registro: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
  }


  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO tbl_desplazamiento (uuid, desplazamiento, costos, enviado, activo, fecha_registro) VALUES (?, ?, ?, ?, ?, ?);`,
      [registro.uuid, registro.desplazamiento, registro.costos, registro?.enviado || 0, 1, registro.fecha_registro],
      (sqlTxn, result) => {
      },
      error => {
        console.log("🚀 ~ file: TblDesplazamientos.jsx:48 ~ addItemDesplazamiento ~ error:", error)
      },
    );
  });
};

export const getDesplazamientos = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM tbl_desplazamiento ORDER BY fecha_registro DESC LIMIT 15;`,
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


export const removeDesplazamiento = (uuid) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `DELETE FROM tbl_desplazamiento WHERE uuid = ?;`,
        [uuid],
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


export const sendDesplazamiento = (uuid) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE tbl_desplazamiento
         SET enviado = 1
         WHERE uuid = ?;`,
        [uuid],
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

export const getLastDesplazamiento = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM tbl_desplazamiento ORDER BY fecha_registro DESC LIMIT 1`,
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

export const removeDesplazamientos = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `DELETE FROM tbl_desplazamiento;`,
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

export const limpiarDesplazamientoDatatable = async() => {

  const now = format(subDays(new Date(), 3), 'yyyy-MM-dd hh:mm:ss' )
    db.transaction(tx => {
      tx.executeSql(
        `DELETE FROM tbl_desplazamiento WHERE date(fecha_registro) < date(?) AND enviado = 1`,
        [now],
        (transaction, res) => {
          console.log('lIMPIEZA DESPLAZAMIENTO');
        },
        (error) => {
          console.log("🚀 ~ file: TblDesplazamientos.jsx:163 ~ limpiarDesplazamientoDatatable ~ error:", error)
        },
      );
    });
}