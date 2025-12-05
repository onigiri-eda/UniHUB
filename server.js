const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// PostgreSQL connection setup
const pool = new Pool({
	user: 'your_username',
	host: 'localhost',
	database: 'unihub',
	password: 'your_password',
	port: 5432, // Default PostgreSQL port
});

// Test database connection
pool.connect((err) => {
	if (err) {
		console.error('Database connection error:', err);
	} else {
		console.log('Connected to PostgreSQL database');
	}
});

// API endpoint to get all universities
app.get('/api/universities', async (req, res) => {
	try {
		const result = await pool.query('SELECT * FROM universities');
		res.json(result.rows);
	} catch (err) {
		console.error('Error fetching universities:', err);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// API endpoint to add a new university
app.post('/api/universities', async (req, res) => {
	const { name, city, description } = req.body;
	try {
		const result = await pool.query(
			'INSERT INTO universities (name, city, description) VALUES ($1, $2, $3) RETURNING *',
			[name, city, description]
		);
		res.status(201).json(result.rows[0]);
	} catch (err) {
		console.error('Error adding university:', err);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Start the server
app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});