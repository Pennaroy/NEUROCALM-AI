'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating an emotional state label based on real-time sensor data.
 *
 * - generateEmotionalState - A function that generates an emotional state label.
 * - EmotionalStateInput - The input type for the generateEmotionalState function.
 * - EmotionalStateOutput - The return type for the generateEmotionalState function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EmotionalStateInputSchema = z.object({
  bloodPressure: z.number().describe('Blood pressure reading.'),
  oxygenLevel: z.number().describe('Oxygen level (SpO₂) reading.'),
  heartRate: z.number().describe('Heart rate reading.'),
  sleepQuality: z.string().describe('Qualitative description of sleep quality.'),
  dailyActivity: z.string().describe('Description of daily activity and steps.'),
});
export type EmotionalStateInput = z.infer<typeof EmotionalStateInputSchema>;

const EmotionalStateOutputSchema = z.object({
  emotionalState: z.string().describe('A short, AI-generated label describing the user\u2019s emotional state.'),
});
export type EmotionalStateOutput = z.infer<typeof EmotionalStateOutputSchema>;

export async function generateEmotionalState(input: EmotionalStateInput): Promise<EmotionalStateOutput> {
  return generateEmotionalStateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'emotionalStatePrompt',
  input: {schema: EmotionalStateInputSchema},
  output: {schema: EmotionalStateOutputSchema},
  prompt: `Based on the following sensor data, generate a short, descriptive label of the user's emotional state.

Sensor Data:
- Blood Pressure: {{{bloodPressure}}}
- Oxygen Level: {{{oxygenLevel}}}
- Heart Rate: {{{heartRate}}}
- Sleep Quality: {{{sleepQuality}}}
- Daily Activity: {{{dailyActivity}}}

Emotional State:`,
});

const generateEmotionalStateFlow = ai.defineFlow(
  {
    name: 'generateEmotionalStateFlow',
    inputSchema: EmotionalStateInputSchema,
    outputSchema: EmotionalStateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
