import app from "./app.js";
import { connectDB } from "./config/database.js";
import { DriverApplication } from "./models/application.model.js";
import { TowRequest } from "./models/request.model.js";
import { seedDriver } from "./utils/seed.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to Database
  await connectDB();

  // Seed Data
  await seedDriver();

  // Start Express App
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
