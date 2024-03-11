const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const port = process.env.PORT || 8080;

// Database connection configuration
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  socketPath: process.env.DB_HOST,
};

app.use(express.json());
app.use(express.static('public')); // Serve static files from 'public' directory

// Sample endpoint to insert and retrieve data from Cloud SQL
app.post('/data', async (req, res) => {
  try {
    const color = req.body.color;
    const timestamp = new Date(); // Current timestamp
    const connection = await mysql.createPool(dbConfig);
    
    // Insert color and timestamp into the database
    await connection.execute('INSERT INTO Colors (color, created_at) VALUES (?, ?)', [color, timestamp]);
    
    // Retrieve the inserted data back as confirmation
    const [rows] = await connection.execute('SELECT color, created_at FROM Colors WHERE color = ? ORDER BY created_at DESC LIMIT 1', [color]);
    
    await connection.end();
    res.status(200).json(rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).send('An error occurred while connecting to the database');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
