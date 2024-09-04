// models/NameModel.js
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('example.db');

export const createTable = async () => {
  await db.runAsync('CREATE TABLE IF NOT EXISTS names (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)');
};

export const addName = async (name) => {
  const result = await db.runAsync('INSERT INTO names (name) VALUES (?)', name);
  return result.lastInsertRowId;
};

export const getNames = async () => {
  const names = await db.getAllAsync('SELECT * FROM names');
  return names;
};

// Outras funções como updateName, deleteName, etc.
