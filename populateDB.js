const fs = require('fs');
const cheerio = require('cheerio');
const { Pool } = require('pg');

// PostgreSQL connection setup
const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'uniHUB',
	password: '38345ow2',
	port: 5432,
});

// Function to extract data from an HTML file
async function extractAndInsertData(filePath) {
	const html = fs.readFileSync(filePath, 'utf-8');
	const $ = cheerio.load(html);

	const name = $('h1#heroTitle').text().trim();
	const city = $('p#heroSubtitle').text().trim();
	const mission = $('section.section p#aboutMission').text().trim();
	const history = $('section.section p#aboutHistory').text().trim();
	const achievements = $('section.section p#aboutAchievements').text().trim();

	try {
		const result = await pool.query(
			'INSERT INTO universities (name, city, mission, history, achievements) VALUES ($1, $2, $3, $4, $5) RETURNING *',
			[name, city, mission, history, achievements]
		);
		console.log(`Inserted: ${result.rows[0].name}`);
	} catch (err) {
		console.error('Error inserting data:', err);
	}
}

// Populate the database with all HTML files
async function populateDatabase() {
	const files = [
		'e:\\UniHUB.kz\\aitu.html',
		'e:\\UniHUB.kz\\kbtu.html',
		'e:\\UniHUB.kz\\uib.html',
		'e:\\UniHUB.kz\\iitu.html'
	];

	for (const file of files) {
		await extractAndInsertData(file);
	}

	console.log('Database population complete.');
	pool.end();
}

populateDatabase();