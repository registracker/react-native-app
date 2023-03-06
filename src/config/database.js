import SQLite from 'react-native-sqlite-storage';


export const db = SQLite.openDatabase(
  {
    name: 'seguimientoDB',
    location: 'default',
  },
  () => { },
  error => {
    console.error(error);
  },
);


export const sincronizarCatalogos = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `
          DELETE FROM tbl_incidente;
          DELETE FROM tbl_medios_desplazamiento;
        `,
        [],
        (transaction, res) => {
          console.log("🚀 ~ file: TblDesplazamientos.jsx:81 ~ returnnewPromise ~ res:", res)
          resolve(res);
        },
        () => {
          reject(false);
        },
      );
    });
  });
}
