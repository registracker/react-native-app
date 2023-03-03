import { db } from '../config/database';

export const createTableIncidentes = () => {
    db.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS tbl_incidente (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT, 
            icono TEXT
            );`,
            [],
            (sqlTxn, result) => {
                console.log('Table created successfully tbl_incidente');
            },
            error => {
                console.log('Error creating table ' + JSON.stringify(error));
            },
        );
    });
};

export const getIncidentesDatabase = () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM tbl_incidente;`,
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

export const storeCatalogoIncidentes = (incidentes) => {
    const sql = incidentes.substring(0, incidentes.length - 1)

    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `INSERT INTO tbl_incidente (id, nombre, icono) VALUES ${sql} ;`,
                [],
                (sqlTxn, result) => {
                    console.log("🚀 ~ file: TblDesplazamientos.jsx:40 ~ addItemDesplazamiento ~ result:", result)
                    resolve(result)
                },
                error => {
                    console.error('error inserting data ' + JSON.stringify(error));
                    reject(error)
                },
            );
        });

    });
};