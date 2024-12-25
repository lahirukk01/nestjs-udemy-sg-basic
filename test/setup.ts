import fs from 'fs';
import path from 'path';

global.beforeEach(async () => {
  const dbPath = path.join(__dirname, '..', 'test.sqlite');

  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }
});
// The code above will delete the test.sqlite file before each test suite runs. This ensures that the database is clean before each test.
