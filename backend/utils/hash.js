// backend/utils/hash.js
import bcrypt from "bcrypt";

/**
 * Generates a secure bcrypt hash from a plain text password.
 * @param {string} password - The plain text string to hash.
 */
async function generateHash(password) {
  try {
    // 10 salt rounds is the industry standard balance between speed and security
    const saltRounds = 10; 
    const hashed = await bcrypt.hash(password, saltRounds);
    
    console.log("\n🔑 ==================================");
    console.log("    PASSWORD HASH GENERATED SUCCESS   ");
    console.log("======================================");
    console.log(`Plain Text:  ${password}`);
    console.log(`Bcrypt Hash: ${hashed}`);
    console.log("======================================\n");
    
    console.log("💡 Copy the full Bcrypt Hash string above to seed your database.\n");
  } catch (error) {
    console.error("❌ Error generating hash:", error.message);
    process.exit(1);
  }
}

// Grab the password argument from the command line interface (CLI)
const input = process.argv[2];

// Validation guard: Ensure they passed a password string
if (!input) {
  console.error("\n⚠️  Missing argument!");
  console.error("Usage:   node backend/hash.js <password>");
  console.error("Example: node backend/hash.js adminPassword123\n");
  process.exit(1);
}

// Execute the async function
generateHash(input);