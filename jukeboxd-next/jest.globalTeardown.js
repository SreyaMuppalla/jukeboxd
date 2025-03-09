import { execSync } from "child_process";

export default async () => {
  console.log("Stopping Firebase Emulators...");

  try {
    // Kill any running Firebase emulators
    execSync("pkill -f firebase", { stdio: "inherit" });
  } catch (error) {
    console.warn("Firebase emulators were not running or already stopped.");
  }
};
