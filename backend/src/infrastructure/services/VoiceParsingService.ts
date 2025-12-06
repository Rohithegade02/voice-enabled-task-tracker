import { ParsedVoiceInput } from '../../types';
import { IVoiceParsingService } from '../../domain/interfaces/IAIService';
import { AssemblyAIService } from './AssemblyAIService';
import { GeminiParserService } from './GeminiParserService';
import { AppError } from '../../interfaces/middleware/errorHandler';

export class VoiceParsingService implements IVoiceParsingService {
  private assemblyAI: AssemblyAIService;
  private gemini: GeminiParserService;

  constructor() {
    this.assemblyAI = new AssemblyAIService();
    this.gemini = new GeminiParserService();
  }

  async transcribeAndParse(audioBuffer: Buffer): Promise<ParsedVoiceInput> {
    // Step 1: Transcribe audio to text (AssemblyAI)
    const transcript = await this.assemblyAI.transcribeAudio(audioBuffer);

    if (!transcript || transcript.trim().length === 0) {
      throw new AppError(400, 'No speech detected in audio');
    }

    // Step 2: Parse transcript to structured task (Gemini 2.5 model(free model))
    const parsedTask = await this.gemini.parseTaskFromTranscript(transcript);

    return parsedTask;
  }
}