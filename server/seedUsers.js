const bcrypt = require("bcrypt");
const { connectToDB2, sql } = require("../config/db");

const users = [
  { username: "catherine", password: "cath@123", role: "receptionist" },
  { username: "douglas", password: "md123", role: "md" },
  { username: "hilary", password: "hillary123", role: "accountant" },
  { username: "evans", password: "vans123", role: "developer" },
  { username: "timothy", password: "tim123", role: "manager" },
];

(async () => {
  try {
    const pool = await connectToDB2();

    for (const user of users) {
      const hash = await bcrypt.hash(user.password, 10);

      await pool.request()
        .input("username", sql.NVarChar, user.username)
        .input("passwordHash", sql.NVarChar, hash)
        .input("role", sql.NVarChar, user.role)
        .query(`
          INSERT INTO StmAppUsers (Username, PasswordHash, Role, IsActive)
          VALUES (@username, @passwordHash, @role, 1)
        `);

      console.log(`Inserted user: ${user.username}`);
    }

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
