import { db } from '../config/database';

export const createTableDesplazamiento = () => {
    db.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS tbl_medios_desplazamiento (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT, 
            icono TEXT,
            );`,
            [],
            (sqlTxn, result) => {
                console.log('Table created successfully');
            },
            error => {
                console.log('Error creating table ' + error[0]);
            },
        );
    });
};

export const getMediosDesplazamientosDatabase = () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM tbl_medios_desplazamiento;`,
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