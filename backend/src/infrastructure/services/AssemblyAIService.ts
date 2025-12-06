import { AssemblyAI } from 'assemblyai';
import { config } from '../../config/env';
import { AppError } from '../../interfaces/middleware/errorHandler';

export class AssemblyAIService {
  private client: AssemblyAI;

  constructor() {
    this.client = new AssemblyAI({
      apiKey: config.ai.assemblyAIKey!,
    });
  }

  async transcribeAudio(audioBuffer: Buffer): Promise<string> {
    try {
      const uploadUrl = await this.client.files.upload(audioBuffer);

      const transcript = await this.client.transcripts.transcribe({
        audio: uploadUrl,
        language_code: 'en',
      });

      if (transcript.status === 'error') {
        throw new AppError(500, `Transcription failed: ${transcript.error}`);
      }

      return transcript.text || '';
    } catch (error) {
      console.error('AssemblyAI transcription error:', error);
      throw new AppError(500, 'Failed to transcribe audio');
    }
  }
}