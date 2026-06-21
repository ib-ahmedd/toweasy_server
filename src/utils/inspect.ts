import { connectDB } from "../config/database.js";
import { Driver } from "../models/driver.model.js";
import { DriverApplication } from "../models/application.model.js";

const run = async () => {
  await connectDB();
  const applications = await DriverApplication.find({});
  console.log("Current Applications in DB:", JSON.stringify(applications, null, 2));

  const drivers = await Driver.find({});
  console.log("Current Drivers before migration:", JSON.stringify(drivers, null, 2));

  // Migrate existing drivers by matching their name to applications and set the email
  for (const driver of drivers) {
    const matchingApp = applications.find(app => app.fullName === driver.name);
    if (matchingApp && !driver.email) {
      driver.email = matchingApp.email;
      await driver.save();
      console.log(`Updated driver ${driver.name} with email ${matchingApp.email}`);
    }
  }

  const finalDrivers = await Driver.find({});
  console.log("Current Drivers after migration:", JSON.stringify(finalDrivers, null, 2));
  
  process.exit(0);
};

run().catch(console.error);
