'use server';

/**
 * @fileOverview A flow for customizing the AI assistant's personality.
 *
 * - customizeAssistantPersonality - A function that customizes the AI assistant's personality.
 * - CustomizeAssistantPersonalityInput - The input type for the customizeAssistantPersonality function.
 * - CustomizeAssistantPersonalityOutput - The return type for the customizeAssistantPersonality function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CustomizeAssistantPersonalityInputSchema = z.object({
  personality: z
    .string()
    .describe(
      'The desired personality of the AI assistant (e.g., calm, friendly, humorous, professional).'
    ),
});
export type CustomizeAssistantPersonalityInput = z.infer<
  typeof CustomizeAssistantPersonalityInputSchema
>;

const CustomizeAssistantPersonalityOutputSchema = z.object({
  success: z.boolean().describe('Indicates whether the personality customization was successful.'),
  message: z.string().describe('A message confirming the personality customization.'),
});
export type CustomizeAssistantPersonalityOutput = z.infer<
  typeof CustomizeAssistantPersonalityOutputSchema
>;

export async function customizeAssistantPersonality(
  input: CustomizeAssistantPersonalityInput
): Promise<CustomizeAssistantPersonalityOutput> {
  return customizeAssistantPersonalityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'customizeAssistantPersonalityPrompt',
  input: {schema: CustomizeAssistantPersonalityInputSchema},
  output: {schema: CustomizeAssistantPersonalityOutputSchema},
  prompt: `You are an AI assistant tasked with customizing your personality based on user preferences.

  The user wants you to adopt a personality that is: {{{personality}}}.

  Confirm that you have updated your personality and provide a brief message to the user.
`,
});

const customizeAssistantPersonalityFlow = ai.defineFlow(
  {
    name: 'customizeAssistantPersonalityFlow',
    inputSchema: CustomizeAssistantPersonalityInputSchema,
    outputSchema: CustomizeAssistantPersonalityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
