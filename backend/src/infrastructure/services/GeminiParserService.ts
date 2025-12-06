import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../../config/env';
import { ParsedVoiceInput, TaskPriority, TaskStatus } from '../../types';
import { AppError } from '../../interfaces/middleware/errorHandler';
import { parseISO, addDays, nextMonday, nextTuesday, nextWednesday, nextThursday, nextFriday, nextSaturday, nextSunday } from 'date-fns';

export class GeminiParserService {
  private client: GoogleGenerativeAI;
  private readonly modelName = 'gemini-2.5-flash';

  constructor() {
    this.client = new GoogleGenerativeAI(config.ai.geminiKey!);
  }

  async parseTaskFromTranscript(transcript: string): Promise<ParsedVoiceInput> {
    try {
      const prompt = this.buildPrompt(transcript);
      const model = this.client.getGenerativeModel({ model: this.modelName });
      const result = await model.generateContent(prompt);

      const text = result.response.text();
      const jsonMatch = text?.match(/\{[\s\S]*\}/);

      if (!jsonMatch) throw new AppError(500, 'No JSON found in response');

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        transcript,
        title: parsed.title || this.extractSimpleTitle(transcript),
        description: parsed.description || undefined,
        priority: this.mapPriority(parsed.priority),
        dueDate: this.parseDate(parsed.dueDate),
        status: this.mapStatus(parsed.status),
      };
    } catch (error) {
      console.error('Gemini parsing error:', error);
      return this.fallbackParsing(transcript);
    }
  }

  private buildPrompt(transcript: string): string {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });

    return `You are an AI assistant extracting task details.
Today: ${todayStr} (${dayOfWeek})
Input: "${transcript}"

PRIORITY RULES:
- High: "urgent", "critical", "asap", "high priority", "immediately"
- Low: "low priority", "whenever", "not urgent", "no rush"
- Medium: Default

DATE RULES:
- "tomorrow" → ${addDays(today, 1).toISOString().split('T')[0]}
- "next [Day]" → Date of next specific weekday
- "in 3 days" → Add 3 days
- "by Friday" → Coming Friday
- Specific dates → YYYY-MM-DD
- None → null

TITLE RULES:
- Remove: "create", "add", "remind me to", "todo"
- No date/priority in title
- Under 100 chars

Return ONLY JSON:
{
  "title": "string",
  "description": "string|null",
  "priority": "Low|Medium|High",
  "dueDate": "YYYY-MM-DD|null",
  "status": "To Do|In Progress|Done"
}`;
  }

  private mapPriority(priority: string | undefined): TaskPriority {
    if (!priority) return TaskPriority.MEDIUM;
    const normalized = priority.toLowerCase().trim();
    if (normalized === 'high') return TaskPriority.HIGH;
    if (normalized === 'low') return TaskPriority.LOW;
    return TaskPriority.MEDIUM;
  }

  private mapStatus(status: string | undefined): TaskStatus {
    if (!status) return TaskStatus.TODO;
    const normalized = status.toLowerCase().trim();
    if (normalized === 'in progress') return TaskStatus.IN_PROGRESS;
    if (normalized === 'done') return TaskStatus.DONE;
    return TaskStatus.TODO;
  }

  private parseDate(dateStr: string | undefined): Date | undefined {
    if (!dateStr || dateStr === 'null') return undefined;
    try {
      const date = parseISO(dateStr);
      return !isNaN(date.getTime()) ? date : undefined;
    } catch {
      return undefined;
    }
  }

  private extractSimpleTitle(transcript: string): string {
    let title = transcript
      .replace(/^(create|add|new|make)\s+(a\s+)?(task\s+)?/i, '')
      .replace(/^(remind me to|i need to|todo:?)\s+/i, '')
      .replace(/\s+(by|before|on|next|this)\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|today|week|month).*/i, '')
      .replace(/\s*,?\s*(it's|its|this is)?\s*(high|low|medium)?\s*priority\s*/i, '')
      .trim();

    title = title.charAt(0).toUpperCase() + title.slice(1);
    return title.length > 100 ? title.substring(0, 97) + '...' : (title || 'New Task');
  }

  private fallbackParsing(transcript: string): ParsedVoiceInput {
    const lower = transcript.toLowerCase();
    let priority = TaskPriority.MEDIUM;

    if (['high priority', 'urgent', 'critical', 'asap', 'important'].some(w => lower.includes(w))) {
      priority = TaskPriority.HIGH;
    } else if (['low priority', 'whenever', 'not urgent'].some(w => lower.includes(w))) {
      priority = TaskPriority.LOW;
    }

    let dueDate: Date | undefined;
    const today = new Date();

    if (lower.includes('tomorrow')) dueDate = addDays(today, 1);
    else if (lower.includes('next monday')) dueDate = nextMonday(today);
    else if (lower.includes('next tuesday')) dueDate = nextTuesday(today);
    else if (lower.includes('next wednesday')) dueDate = nextWednesday(today);
    else if (lower.includes('next thursday')) dueDate = nextThursday(today);
    else if (lower.includes('next friday')) dueDate = nextFriday(today);
    else if (lower.includes('next saturday')) dueDate = nextSaturday(today);
    else if (lower.includes('next sunday')) dueDate = nextSunday(today);

    return {
      transcript,
      title: this.extractSimpleTitle(transcript),
      priority,
      dueDate,
      status: TaskStatus.TODO,
    };
  }
}