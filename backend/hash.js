// hash.js
const bcrypt = require('bcrypt');

const password = "Admin@123"; // choose your own strong password

bcrypt.hash(password, 10).then(hash => {
  console.log("Hashed password:", hash);
});
