import { User } from "telegraf/types";
import inMemory from "../src/databases/inMemory.ts"; // Add .ts if using ESM

async function runTest() {
  console.log("🚀 Starting InMemory test...");

  const users: User[] = [
    { id: 1, is_bot: false, first_name: "Alice" },
    { id: 2, is_bot: false, first_name: "Bob" },
    { id: 3, is_bot: false, first_name: "Charlie" },
    { id: 4, is_bot: false, first_name: "Diana" },
    { id: 5, is_bot: false, first_name: "Evan" },
    { id: 6, is_bot: false, first_name: "Fay" },
    { id: 7, is_bot: false, first_name: "George" },
    { id: 8, is_bot: false, first_name: "Helen" },
    { id: 9, is_bot: false, first_name: "Ivan" },
    { id: 10, is_bot: false, first_name: "Judy" },
  ];

  // Clear old data before testing
  inMemory.users.clear();

  for (const user of users) {
    await inMemory.saveUser(user);
  }

  const total = await inMemory.getTotalUsers();
  console.log(`👥 Total users: ${total}`); // Should log 10

  // Helper function for running a paginated query
  async function logPaginated(offset: number, limit: number) {
    const result: User[] = [];
    for await (const user of inMemory.getAllUsers({ offset, limit })) {
      result.push(user);
    }
    console.log(
      `🔹 Offset ${offset}, Limit ${limit} →`,
      result.map((u) => u.first_name),
    );
  }

  // Try different combinations
  await logPaginated(0, 3); // First 3 users
  await logPaginated(3, 3); // Next 3 users
  await logPaginated(6, 3); // Final 3 users (one will be missing)
  await logPaginated(5, 10); // Starts from 6th user, get the rest
  await logPaginated(0, 0); // Should return nothing
  await logPaginated(9, 1); // Should return Judy
  await logPaginated(10, 5); // Should return nothing (offset out of bounds)

  console.log("✅ Done");
}

runTest();
