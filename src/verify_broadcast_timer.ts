import { Broadcast } from "./services/broadcast.js";
import database from "./services/database.js";
import { Telegraf } from "telegraf";

// Mock database
const mockUsers = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];

database.getTotalUsers = async () => mockUsers.length;
database.getAllUsers = async function* () {
  for (const user of mockUsers) {
    yield user as any;
  }
};

// Mock bot
const mockBot = {
  telegram: {
    copyMessage: async () => {
      await new Promise((resolve) => setTimeout(resolve, 5213)); // Simulate delay
      return { message_id: 123 };
    },
  },
} as unknown as Telegraf<any>;

async function run() {
  console.log("Starting broadcast verification...");
  const broadcast = new Broadcast(mockBot);

  const statsBefore = broadcast.getStats();
  console.log("Stats before:", statsBefore);

  console.log("Starting broadcast...");
  const broadcastPromise = broadcast.broadcastMessage(1, 1);

  // Check stats during broadcast
  await new Promise((resolve) => setTimeout(resolve, 100));
  const statsRunning = broadcast.getStats();
  console.log("Stats running (should show time taken):");
  console.log(statsRunning);

  await broadcastPromise;

  const statsAfter = broadcast.getStats();
  console.log("Stats after (should show final time taken):");
  console.log(statsAfter);

  if (statsAfter.includes("Time taken:")) {
    console.log("VERIFICATION SUCCESS: 'Time taken' field found in stats.");
  } else {
    console.error(
      "VERIFICATION FAILED: 'Time taken' field NOT found in stats.",
    );
    process.exit(1);
  }
}

run().catch(console.error);
