import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../../config/env';
import { ParsedVoiceInput, TaskPriority, TaskStatus } from '../../types';
import { parseISO } from 'date-fns';

export class GeminiParserService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(config.ai.geminiKey!);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async parseTaskFromTranscript(transcript: string): Promise<ParsedVoiceInput> {
    try {
      const prompt = this.buildPrompt(transcript);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from response (Gemini might wrap it in markdown)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        transcript,
        title: parsed.title || undefined,
        description: parsed.description || undefined,
        priority: this.mapPriority(parsed.priority),
        dueDate: this.parseDate(parsed.dueDate),
        status: this.mapStatus(parsed.status),
      };
    } catch (error) {
      console.error('Gemini parsing error:', error);
      // Return basic parsed data with just the transcript
      return {
        transcript,
        title: this.extractSimpleTitle(transcript),
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.TODO,
      };
    }
  }

  private buildPrompt(transcript: string): string {
    const today = new Date().toISOString().split('T')[0];
    
    return `You are a task parsing assistant. Extract structured task information from the user's natural language input.

Current date: ${today}

Input transcript: "${transcript}"

Extract and return ONLY a JSON object with these fields:
{
  "title": "Brief task title (string, required)",
  "description": "Additional details if mentioned (string, optional)",
  "priority": "Low | Medium | High (based on keywords like urgent, critical, high priority, low priority)",
  "dueDate": "ISO date string (YYYY-MM-DD) or null",
  "status": "To Do | In Progress | Done (default: To Do)"
}

Date parsing rules:
- "tomorrow" → add 1 day to current date
- "next week" or "next Monday/Tuesday/etc" → specific day next week
- "in 3 days" → add 3 days
- "January 15" or "15th January" → specific date in current/next year
- "by Friday" or "before Friday" → coming Friday
- "tonight" or "this evening" → today at 18:00
- If time mentioned (e.g., "6 PM", "evening"), ignore time, just use date

Priority detection:
- "urgent", "critical", "asap", "high priority" → "High"
- "low priority", "whenever", "not urgent" → "Low"  
- Default → "Medium"

Title extraction:
- Remove filler words like "create", "add", "remind me to"
- Keep the core task description
- Max 100 characters

Return ONLY the JSON object, no explanation.`;
  }

  private mapPriority(priority: string | undefined): TaskPriority {
    if (!priority) return TaskPriority.MEDIUM;
    
    const normalized = priority.toLowerCase();
    if (normalized === 'high') return TaskPriority.HIGH;
    if (normalized === 'low') return TaskPriority.LOW;
    return TaskPriority.MEDIUM;
  }

  private mapStatus(status: string | undefined): TaskStatus {
    if (!status) return TaskStatus.TODO;
    
    const normalized = status.toLowerCase();
    if (normalized === 'in progress') return TaskStatus.IN_PROGRESS;
    if (normalized === 'done') return TaskStatus.DONE;
    return TaskStatus.TODO;
  }

  private parseDate(dateStr: string | undefined): Date | undefined {
    if (!dateStr || dateStr === 'null') return undefined;

    try {
      // Try parsing ISO date
      const date = parseISO(dateStr);
      if (!isNaN(date.getTime())) {
        return date;
      }
    } catch (error) {
      console.error('Date parsing error:', error);
    }

    return undefined;
  }

  // Fallback simple title extraction
  private extractSimpleTitle(transcript: string): string {
    // Remove common task creation phrases
    let title = transcript
      .replace(/^(create|add|new|make)\s+(a\s+)?(task\s+)?/i, '')
      .replace(/^(remind me to|i need to|todo:?)\s+/i, '')
      .trim();

    // Capitalize first letter
    title = title.charAt(0).toUpperCase() + title.slice(1);

    // Limit length
    if (title.length > 100) {
      title = title.substring(0, 97) + '...';
    }

    return title || 'New Task';
  }
}