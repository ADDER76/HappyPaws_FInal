import path from 'node:path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const dbPromise = open({
  filename: path.resolve('data', 'app.db'),
  driver: sqlite3.Database,
});

export const getDb = () => dbPromise;
