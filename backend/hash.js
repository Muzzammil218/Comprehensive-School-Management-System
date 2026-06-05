const bcrypt = require("bcrypt");

async function generateHash(password) {
  const hashed = await bcrypt.hash(password, 10);
  console.log(`Plain: ${password}`);
  console.log(`Hashed: ${hashed}`);
}

const input = process.argv[2];
if (!input) {
  console.error("⚠️ Please provide a password. Example: node hash.js mypassword");
  process.exit(1);
}

generateHash(input);
