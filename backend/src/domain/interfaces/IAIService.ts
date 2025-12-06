import { ParsedVoiceInput } from '../../types';

// assembly ai service interface
export interface IVoiceParsingService {
  transcribeAndParse(audioBuffer: Buffer): Promise<ParsedVoiceInput>;
}