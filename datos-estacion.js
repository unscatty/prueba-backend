const express = require('express');
const mariadb = require('mariadb');

const app = express();

const pool = mariadb.createPool({
  host: 'precios-1.c0f6dm2ucnlg.us-east-2.rds.amazonaws.com',
  user: 'candidatoPrueba',
  password: 'gaspre21.M',
  port: 3306,
  connectionLimit: 5,
  database: 'prueba'
});

app.get('/datos-estacion/', async (req, res) => {
  let conn;
  try {
    const id = decodeURIComponent(req.query.id);

    // Obtiene los datos de la estacion
    conn = await pool.getConnection();
    const stationData = await conn.query(
      `SELECT
        st.name as nombre,
        br.name as marca
      FROM stations as st
      JOIN stations_brands as sb ON st.cre_id = sb.cre_id
      JOIN brands as br ON sb.id_brand = br.id
      WHERE st.cre_id = '${id}'
      `
    );


    // Obtiene los productos ofrecidos por la estacion
    const products = await conn.query(
      `SELECT
        pr.product as producto,
        pr.value as precio
      FROM stations as st
      JOIN prices as pr ON pr.cre_id = st.cre_id
      WHERE st.cre_id = '${id}'
      GROUP BY producto
      ORDER BY producto ASC
      `
    );

    // Obtiene informacion sobre los competidores
    const competitors = await conn.query(
      `SELECT 
        comp.name as competidor,
        sc.distance as distancia,
        pr.product as producto,
        pr.value as precio
      FROM 
        stations as comp JOIN stations_competitors as sc ON comp.cre_id = sc.cre_id
        JOIN stations as st ON sc.cre_id = st.cre_id
        JOIN prices as pr ON pr.cre_id = st.cre_id
      WHERE st.cre_id = '${id}'
      GROUP BY competidor
      ORDER BY competidor ASC
      `
    );

    // Calcula la diferencia de precios entre la estacion y sus competidores
    competitors.map(comp => {
      const productoCompetencia = products.find(prod => prod.producto === comp.producto)
      if (productoCompetencia) {
        comp.diferencia = productoCompetencia.precio - comp.precio
      }
      return comp
    })
    
    res.json({
      ...stationData[0],
      productos: products,
      competidores: competitors
    });
  } catch (err) {
    throw err;
  } finally {
    if (conn) {
      conn.release();
    }
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});