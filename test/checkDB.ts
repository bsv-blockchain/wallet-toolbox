const Database = require('better-sqlite3')

const dbPath = 'test/data/tmp/updatetest.sqlite' // Path to your SQLite database file

const runTest = () => {
  // Open the database
  let db
  try {
    db = new Database(dbPath)
    console.log(`Connected to the SQLite database at ${dbPath}`)
  } catch (err: unknown) {
    console.error('Error opening database:', (err as Error).message)
    process.exit(1)
  }

  // Check if foreign key enforcement is enabled
  try {
    const row = db.pragma('foreign_keys', { simple: true })
    console.log('Foreign key enforcement:', row === 1 ? 'Enabled' : 'Disabled')
  } catch (err: unknown) {
    console.error('Error running PRAGMA foreign_keys:', (err as Error).message)
  }

  // List foreign key constraints for a specific table
  const tables = ['certificates', 'commissions', 'output_baskets', 'outputs']
  for (const table of tables) {
    try {
      const rows = db.pragma(`foreign_key_list('${table}')`)
      console.log(`Foreign key constraints for table '${table}':`)
      if (rows.length === 0) {
        console.log('  No foreign key constraints defined.')
      } else {
        rows.forEach(fk => {
          console.log(
            `  Column '${fk.from}' references '${fk.table}(${fk.to})' ` +
              `ON UPDATE ${fk.on_update} ON DELETE ${fk.on_delete}`
          )
        })
      }
    } catch (err: unknown) {
      console.error(`Error querying foreign key list for table '${table}':`, (err as Error).message)
    }
  }

  // Close the database
  try {
    db.close()
    console.log('Database connection closed.')
  } catch (err: unknown) {
    console.error('Error closing database:', (err as Error).message)
  }
}

// Run the test
runTest()
