const express = require('express');
const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: 'precios-1.c0f6dm2ucnlg.us-east-2.rds.amazonaws.com',
  user: 'candidatoPrueba',
  password: 'gaspre21.M',
  port: 3306,
  connectionLimit: 5
});

async function asyncFunction() {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT 1 as val");
    console.log(rows); //[ {val: 1}, meta: ... ]
  } catch (err) {
    throw err;
  } finally {
    if (conn) return conn.end();
  }
}

asyncFunction()