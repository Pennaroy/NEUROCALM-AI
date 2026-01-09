'use server';

/**
 * @fileOverview A general-purpose AI assistant flow that uses message history
 * to provide conversational responses.
 *
 * This file exports:
 * - `assistantFlow`: An async function that generates a conversational response.
 * - `AssistantFlowInput`: The input type for the `assistantFlow` function.
 * - `AssistantFlowOutput`: The output type for the `assistantFlow` function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.array(z.object({ text: z.string() })),
});

const AssistantFlowInputSchema = z.object({
  history: z
    .array(MessageSchema)
    .describe('The message history for the conversation.'),
});
export type AssistantFlowInput = z.infer<typeof AssistantFlowInputSchema>;

const AssistantFlowOutputSchema = z.object({
  text: z.string().describe('The AI-generated response.'),
});
export type AssistantFlowOutput = z.infer<typeof AssistantFlowOutputSchema>;

export async function assistantFlow(input: AssistantFlowInput): Promise<AssistantFlowOutput> {
  return assistantFlowInternal(input);
}

const assistantFlowInternal = ai.defineFlow(
  {
    name: 'assistantFlow',
    inputSchema: AssistantFlowInputSchema,
    outputSchema: AssistantFlowOutputSchema,
  },
  async ({ history }) => {
    const response = await ai.generate({
      history,
      prompt:
        'You are a friendly and helpful AI assistant named NeuroCalm. Your goal is to support users in their mental wellness journey.',
    });

    return { text: response.text };
  }
);
