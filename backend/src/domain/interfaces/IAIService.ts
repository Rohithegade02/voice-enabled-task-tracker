import { ParsedVoiceInput } from '../../types';

export interface IVoiceParsingService {
  transcribeAndParse(audioBuffer: Buffer): Promise<ParsedVoiceInput>;
}