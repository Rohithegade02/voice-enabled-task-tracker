import { AssemblyAI } from 'assemblyai';
import { config } from '../../config/env';

export class AssemblyAIService {
  private client: AssemblyAI;

  constructor() {
    this.client = new AssemblyAI({
      apiKey: config.ai.assemblyAIKey || '',
    });
  }

  async transcribeAudio(audioBuffer: Buffer): Promise<string> {
    try {
      // Upload audio file
      const uploadUrl = await this.client.files.upload(audioBuffer);

      // Transcribe
      const transcript = await this.client.transcripts.transcribe({
        audio: uploadUrl,
        language_code: 'en',
      });

      if (transcript.status === 'error') {
        throw new Error(`Transcription failed: ${transcript.error}`);
      }

      return transcript.text || '';
    } catch (error) {
      console.error('AssemblyAI transcription error:', error);
      throw new Error('Failed to transcribe audio');
    }
  }
}