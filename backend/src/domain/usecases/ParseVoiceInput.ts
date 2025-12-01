import { IVoiceParsingService } from '../interfaces/IAIService';
import { ParsedVoiceInput } from '../../types';

export class ParseVoiceInputUseCase {
  constructor(private voiceParsingService: IVoiceParsingService) {}

  async execute(audioBuffer: Buffer): Promise<ParsedVoiceInput> {
    if (!audioBuffer || audioBuffer.length === 0) {
      throw new Error('Audio buffer is empty');
    }

    // Use AI service to transcribe and parse
    const parsedInput = await this.voiceParsingService.transcribeAndParse(audioBuffer);

    if (!parsedInput.transcript || parsedInput.transcript.trim().length === 0) {
      throw new Error('No speech detected in audio');
    }

    return parsedInput;
  }
}