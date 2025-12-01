import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodb: {
    uri: process.env.MONGODB_URI
  },
  ai: {
    assemblyAIKey: process.env.ASSEMBLYAI_API_KEY,
    geminiKey: process.env.GEMINI_API_KEY,
  },
};

// Validate required environment variables
const requiredEnvVars = ['ASSEMBLYAI_API_KEY', 'GEMINI_API_KEY'];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.warn(`⚠️  Warning: Missing environment variables: ${missingEnvVars.join(', ')}`);
}