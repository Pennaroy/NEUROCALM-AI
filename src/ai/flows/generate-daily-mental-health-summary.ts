'use server';
/**
 * @fileOverview Generates a daily mental health summary for the user.
 *
 * - generateDailyMentalHealthSummary - A function that generates the daily mental health summary.
 * - GenerateDailyMentalHealthSummaryInput - The input type for the generateDailyMentalHealthSummary function.
 * - GenerateDailyMentalHealthSummaryOutput - The return type for the generateDailyMentalHealthSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDailyMentalHealthSummaryInputSchema = z.object({
  moodIndex: z.number().describe('The user’s mood index for the day.'),
  emotionalStabilityRating: z
    .number()
    .describe('The user’s emotional stability rating for the day.'),
  stressRiskLevel: z
    .string()
    .describe('The user’s stress risk level for the day (e.g., low, medium, high).'),
  sleepRecoveryScore: z.number().describe('The user’s sleep recovery score for the day.'),
  dailyActivity: z.string().describe('A description of the user’s daily activity.'),
  heartRate: z.number().describe('The user\'s average heart rate for the day.'),
  bloodPressure: z.string().describe('The user\'s average blood pressure for the day.'),
  oxygenLevel: z.number().describe('The user\'s average oxygen saturation (SpO2) for the day.'),
});
export type GenerateDailyMentalHealthSummaryInput = z.infer<
  typeof GenerateDailyMentalHealthSummaryInputSchema
>;

const GenerateDailyMentalHealthSummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of the user’s mental health for the day.'),
});
export type GenerateDailyMentalHealthSummaryOutput = z.infer<
  typeof GenerateDailyMentalHealthSummaryOutputSchema
>;

export async function generateDailyMentalHealthSummary(
  input: GenerateDailyMentalHealthSummaryInput
): Promise<GenerateDailyMentalHealthSummaryOutput> {
  return generateDailyMentalHealthSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDailyMentalHealthSummaryPrompt',
  input: {schema: GenerateDailyMentalHealthSummaryInputSchema},
  output: {schema: GenerateDailyMentalHealthSummaryOutputSchema},
  prompt: `You are an AI mental health assistant. Generate a concise, insightful, and supportive daily summary of the user's mental and physical health based on the following information. Highlight trends and offer a piece of actionable advice.

- Mood Index: {{{moodIndex}}}/10
- Emotional Stability Rating: {{{emotionalStabilityRating}}}/10
- Stress Risk Level: {{{stressRiskLevel}}}
- Sleep Recovery Score: {{{sleepRecoveryScore}}}/100
- Daily Activity: {{{dailyActivity}}}
- Heart Rate: {{{heartRate}}} BPM
- Blood Pressure: {{{bloodPressure}}} mmHg
- Oxygen Level: {{{oxygenLevel}}}%

Summary:`,
});

const generateDailyMentalHealthSummaryFlow = ai.defineFlow(
  {
    name: 'generateDailyMentalHealthSummaryFlow',
    inputSchema: GenerateDailyMentalHealthSummaryInputSchema,
    outputSchema: GenerateDailyMentalHealthSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
