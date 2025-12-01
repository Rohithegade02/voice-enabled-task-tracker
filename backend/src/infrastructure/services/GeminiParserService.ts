import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../../config/env';
import { ParsedVoiceInput, TaskPriority, TaskStatus } from '../../types';
import { parseISO, addDays, nextMonday, nextTuesday, nextWednesday, nextThursday, nextFriday, nextSaturday, nextSunday } from 'date-fns';

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

      // Extract JSON from response (remove markdown code blocks if present)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('Gemini response:', text);
        throw new Error('No JSON found in Gemini response');
      }

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
      // Fallback to manual parsing
      return this.fallbackParsing(transcript);
    }
  }

  private buildPrompt(transcript: string): string {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });

    return `You are an AI assistant that extracts task information from natural language.

Today's date: ${todayStr} (${dayOfWeek})

User said: "${transcript}"

Carefully analyze the input and extract task details. Pay special attention to priority keywords.

PRIORITY DETECTION RULES (VERY IMPORTANT):
- If the text contains ANY of these words, set priority to "High":
  * "high priority"
  * "high-priority"
  * "urgent"
  * "critical"
  * "asap"
  * "immediately"
  * "important"
  * "it's high priority"
  * "this is urgent"
  
- If the text contains ANY of these words, set priority to "Low":
  * "low priority"
  * "low-priority"
  * "whenever"
  * "not urgent"
  * "when you can"
  * "no rush"
  
- Otherwise, set priority to "Medium"

DATE PARSING RULES:
- "tomorrow" → ${addDays(today, 1).toISOString().split('T')[0]}
- "next Monday" → next Monday's date
- "next Tuesday" → next Tuesday's date
- "next Wednesday" → next Wednesday's date
- "next Thursday" → next Thursday's date
- "next Friday" → next Friday's date
- "next Saturday" → next Saturday's date
- "next Sunday" → next Sunday's date
- "in 3 days" → add 3 days to today
- "by Friday" → coming Friday
- Specific dates like "January 15" or "15th Jan" → parse to YYYY-MM-DD
- If no date mentioned → null

TITLE EXTRACTION RULES:
- Remove these phrases from the beginning: "create", "add", "new task", "remind me to", "I need to", "todo"
- Keep the core action/task description
- Remove date information from title
- Remove priority information from title
- Keep it concise (under 100 characters)

STATUS RULES:
- Default to "To Do" unless explicitly mentioned
- "in progress", "working on" → "In Progress"
- "done", "completed", "finished" → "Done"

Return ONLY a valid JSON object (no markdown, no explanation):
{
  "title": "extracted title here",
  "description": "additional details if any (or null)",
  "priority": "Low" | "Medium" | "High",
  "dueDate": "YYYY-MM-DD" | null,
  "status": "To Do" | "In Progress" | "Done"
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
      if (!isNaN(date.getTime())) {
        return date;
      }
    } catch (error) {
      console.error('Date parsing error:', error);
    }

    return undefined;
  }

  private extractSimpleTitle(transcript: string): string {
    let title = transcript
      .replace(/^(create|add|new|make)\s+(a\s+)?(task\s+)?/i, '')
      .replace(/^(remind me to|i need to|todo:?)\s+/i, '')
      .replace(/\s+(by|before|on|next|this)\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|today|week|month).*/i, '')
      .replace(/\s*,?\s*(it's|its|this is)?\s*(high|low|medium)?\s*priority\s*/i, '')
      .trim();

    title = title.charAt(0).toUpperCase() + title.slice(1);

    if (title.length > 100) {
      title = title.substring(0, 97) + '...';
    }

    return title || 'New Task';
  }

  // Fallback manual parsing if Gemini fails
  private fallbackParsing(transcript: string): ParsedVoiceInput {
    const lowerTranscript = transcript.toLowerCase();

    // Detect priority manually
    let priority = TaskPriority.MEDIUM;
    if (
      lowerTranscript.includes('high priority') ||
      lowerTranscript.includes('urgent') ||
      lowerTranscript.includes('critical') ||
      lowerTranscript.includes('asap') ||
      lowerTranscript.includes('important')
    ) {
      priority = TaskPriority.HIGH;
    } else if (
      lowerTranscript.includes('low priority') ||
      lowerTranscript.includes('whenever') ||
      lowerTranscript.includes('not urgent')
    ) {
      priority = TaskPriority.LOW;
    }

    // Detect date manually
    let dueDate: Date | undefined = undefined;
    const today = new Date();
    
    if (lowerTranscript.includes('tomorrow')) {
      dueDate = addDays(today, 1);
    } else if (lowerTranscript.includes('next monday')) {
      dueDate = nextMonday(today);
    } else if (lowerTranscript.includes('next tuesday')) {
      dueDate = nextTuesday(today);
    } else if (lowerTranscript.includes('next wednesday')) {
      dueDate = nextWednesday(today);
    } else if (lowerTranscript.includes('next thursday')) {
      dueDate = nextThursday(today);
    } else if (lowerTranscript.includes('next friday')) {
      dueDate = nextFriday(today);
    } else if (lowerTranscript.includes('next saturday')) {
      dueDate = nextSaturday(today);
    } else if (lowerTranscript.includes('next sunday')) {
      dueDate = nextSunday(today);
    }

    return {
      transcript,
      title: this.extractSimpleTitle(transcript),
      priority,
      dueDate,
      status: TaskStatus.TODO,
    };
  }
}