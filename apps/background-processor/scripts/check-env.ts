// scripts/check-env.ts
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

function validateEnvAgainstTemplate() {
  // Read .env.template and .env files
  const templatePath = path.join(process.cwd(), ".env.template");
  const envPath = path.join(process.cwd(), ".env");

  // Check if .env.template exists
  if (!fs.existsSync(templatePath)) {
    console.error("\x1b[31m%s\x1b[0m", "❌ .env.template file not found");
    process.exit(1);
  }

  // Check if .env exists
  if (!fs.existsSync(envPath)) {
    console.error("\x1b[31m%s\x1b[0m", "❌ .env file not found");
    console.error(
      "\x1b[33m%s\x1b[0m",
      "⚠️ Please create a .env file based on .env.template"
    );
    process.exit(1);
  }

  // Parse both files
  const templateVars = dotenv.parse(fs.readFileSync(templatePath));
  const envVars = dotenv.parse(fs.readFileSync(envPath));

  // Check for missing variables
  const missingVars = Object.keys(templateVars).filter(
    (key) => !(key in envVars)
  );

  if (missingVars.length > 0) {
    console.error("\x1b[31m%s\x1b[0m", "❌ Missing environment variables:");
    missingVars.forEach((variable) => {
      console.error("\x1b[33m%s\x1b[0m", `⚠️ ${variable}`);
    });
    console.error(
      "\x1b[33m%s\x1b[0m",
      "⚠️ Please add these variables to your .env file"
    );
    process.exit(1);
  }

  console.log(
    "\x1b[32m%s\x1b[0m",
    "✅ All environment variables from .env.template are present in .env"
  );
}

validateEnvAgainstTemplate();
