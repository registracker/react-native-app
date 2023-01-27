import {openDatabase} from 'react-native-sqlite-storage';
import SQLite from 'react-native-sqlite-storage';

const tableName = 'tbl_recorridos';

const db = SQLite.openDatabase(
  {
    name: 'seguimientoDB',
    location: 'default',
  },
  () => {},
  error => {
    console.log(error);
  },
);

const createTable = tableName => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS ${tableName}' +
        '(ID INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Age INTEGER );',
    );
  });
};

const getDBConnection = async () => {
  return openDatabase({name: 'todo-data.db', location: 'default'});
};

exports.modules = {
  db,
  createTable,
  getDBConnection,
};
