const db = require('./db')()
const fs = require('fs');
const path = require('path');

const migrate = async () => {
  for (let file of fs.readdirSync(path.join(__dirname, "sql"))) {
    const [rows] = await db.query('SELECT ID FROM Z_MIGRATION WHERE MIGRATION = ?', file)
    if (rows.length > 0) {
      console.log(`skip ${file}`)
    } else {
      const migration = fs.readFileSync(path.join(__dirname, "sql", file)).toString('utf-8')
      await db.query(migration)
      console.log('migrated ' + file)
      await db.query('INSERT INTO Z_MIGRATION (MIGRATION, CREATED_AT) VALUES (?, NOW())', file)
    }
  }
  db.end()
}

migrate()