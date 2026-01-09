'use server';
/**
 * @fileOverview AI-powered personalized reminders for mental health and well-being.
 *
 * - personalizedAIReminders - A function that provides personalized reminders based on user data.
 * - PersonalizedAIRemindersInput - The input type for the personalizedAIReminders function.
 * - PersonalizedAIRemindersOutput - The return type for the personalizedAIReminders function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedAIRemindersInputSchema = z.object({
  emotionalState: z
    .string()
    .describe('The current emotional state of the user (e.g., stressed, anxious, calm).'),
  bloodPressure: z.string().describe('The current blood pressure of the user.'),
  oxygenLevel: z.number().describe('The current oxygen level (SpO2) of the user.'),
  heartRate: z.number().describe('The current heart rate of the user.'),
  sleepQuality: z.string().describe('The sleep quality of the user (e.g., good, poor).'),
  dailyActivity: z.string().describe('The daily activity level of the user (e.g., high, moderate, low).'),
  wellnessGoals: z
    .array(z.string())
    .describe('The wellness goals of the user (e.g., stress reduction, sleep improvement).'),
  assistantPersonality: z.string().describe('The personality of the AI assistant (e.g., calm, friendly).'),
});
export type PersonalizedAIRemindersInput = z.infer<typeof PersonalizedAIRemindersInputSchema>;

const PersonalizedAIRemindersOutputSchema = z.object({
  reminders: z
    .array(z.string())
    .describe(
      'A list of personalized reminders for the user, based on their emotional state, health metrics, and wellness goals.'
    ),
});
export type PersonalizedAIRemindersOutput = z.infer<typeof PersonalizedAIRemindersOutputSchema>;

export async function personalizedAIReminders(
  input: PersonalizedAIRemindersInput
): Promise<PersonalizedAIRemindersOutput> {
  return personalizedAIRemindersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedAIRemindersPrompt',
  input: {schema: PersonalizedAIRemindersInputSchema},
  output: {schema: PersonalizedAIRemindersOutputSchema},
  prompt: `You are an AI assistant that provides personalized reminders to users based on their emotional state, health metrics, and wellness goals.

  Based on the user's current emotional state of {{emotionalState}}, blood pressure of {{bloodPressure}}, oxygen level of {{oxygenLevel}}, heart rate of {{heartRate}}, sleep quality of {{sleepQuality}}, daily activity level of {{dailyActivity}}, wellness goals of {{wellnessGoals}}, and your personality of {{assistantPersonality}}, provide a list of personalized reminders to help the user manage their mental health and well-being.

  Example reminders:
  - Take a 3-minute breathing session to reduce stress.
  - It's time to wind down and prepare for sleep. Try a calming activity.
  - Remember to drink water and stay hydrated.
  - Take a short break from your work to stretch and move around.
  - Practice a short meditation.
  - Consider reframing any negative thoughts.
  - Optimize your sleep schedule for better recovery.

  Here are the personalized reminders:
  `,
});

const personalizedAIRemindersFlow = ai.defineFlow(
  {
    name: 'personalizedAIRemindersFlow',
    inputSchema: PersonalizedAIRemindersInputSchema,
    outputSchema: PersonalizedAIRemindersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
