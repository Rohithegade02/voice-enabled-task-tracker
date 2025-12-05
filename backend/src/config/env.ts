import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const port = process.env.PORT;
const mongodbUri = process.env.MONGODB_URI;
const assemblyAiKey = process.env.ASSEMBLYAI_API_KEY;
const geminiKey = process.env.GEMINI_API_KEY;

export const config = {
  port,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodb: {
    uri: mongodbUri
  },
  ai: {
    assemblyAIKey: assemblyAiKey,
    geminiKey: geminiKey,
  },
};

// Validate required environment variables
const requiredEnvVars = ['ASSEMBLYAI_API_KEY', 'GEMINI_API_KEY'];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.warn(`⚠️  Warning: Missing environment variables: ${missingEnvVars.join(', ')}`);
}