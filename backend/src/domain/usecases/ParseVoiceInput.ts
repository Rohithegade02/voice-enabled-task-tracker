import { IVoiceParsingService } from '../interfaces/IAIService';
import { ParsedVoiceInput } from '../../types';
import { AppError } from '../../interfaces/middleware/errorHandler';

export class ParseVoiceInputUseCase {
  constructor(private voiceParsingService: IVoiceParsingService) { }

  async execute(audioBuffer: Buffer): Promise<ParsedVoiceInput> {
    if (!audioBuffer || audioBuffer.length === 0) {
      throw new AppError(400, 'Audio buffer is empty');
    }

    // Use Assembly AI service to transcribe and parse
    const parsedInput = await this.voiceParsingService.transcribeAndParse(audioBuffer);

    if (!parsedInput.transcript || parsedInput.transcript.trim().length === 0) {
      throw new AppError(400, 'No speech detected in audio');
    }

    return parsedInput;
  }
}