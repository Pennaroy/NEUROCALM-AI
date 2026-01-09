'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SendHorizonal, Bot, User } from "lucide-react";
import { Brain } from "@/components/shared/brain";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useState, useRef, useEffect } from "react";
import { assistantFlow } from "@/ai/flows/assistant-flow";
import { Skeleton } from "@/components/ui/skeleton";

const avatarImage = PlaceHolderImages['avatar'];

export type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
};

const initialMessages: Message[] = [
  { id: '1', text: 'Hello! I am NeuroCalm, your personal mental wellness assistant. How are you feeling today?', sender: 'ai'},
  { id: '2', text: 'Based on your recent data, your stress levels seem a bit high. Would you like to try a 2-minute breathing exercise?', sender: 'ai'},
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // We are only sending the last 10 messages to keep the context light
      const history = newMessages.slice(-10).map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        content: [{ text: m.text }],
      }));

      const response = await assistantFlow({ history });

      const aiResponse: Message = { id: (Date.now() + 1).toString(), text: response.text, sender: 'ai' };
      setMessages(prev => [...prev, aiResponse]);
    } catch (e) {
      const errorResponse: Message = { id: (Date.now() + 1).toString(), text: "I'm having trouble connecting right now. Please try again later.", sender: 'ai' };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col relative bg-cross-gradient">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-4xl w-full h-[500px] z-0 opacity-10 dark:opacity-20">
        <Brain className="h-full w-full" />
      </div>

      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-4 space-y-6 sm:p-6 lg:p-8">
          {messages.map((message) => (
            <div key={message.id} className={`flex items-start gap-4 ${message.sender === 'user' ? 'justify-end' : ''}`}>
              {message.sender === 'ai' && (
                <Avatar className="border">
                  <AvatarFallback><Bot size={20}/></AvatarFallback>
                </Avatar>
              )}
              <Card className={`max-w-md ${message.sender === 'ai' ? 'bg-secondary/80 backdrop-blur-sm' : 'bg-primary text-primary-foreground'}`}>
                <CardContent className="p-3 text-sm whitespace-pre-wrap">
                  {message.text}
                </CardContent>
              </Card>
              {message.sender === 'user' && avatarImage && (
                <Avatar className="border">
                  <AvatarImage src={avatarImage.imageUrl} alt={avatarImage.description} />
                  <AvatarFallback><User size={20} /></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-4">
               <Avatar className="border">
                  <AvatarFallback><Bot size={20}/></AvatarFallback>
                </Avatar>
                <Card className="max-w-md bg-secondary/80 backdrop-blur-sm">
                  <CardContent className="p-3 space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </CardContent>
                </Card>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t sticky bottom-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="relative max-w-3xl mx-auto">
          <Input 
            placeholder="Ask for advice or tell me how you feel..." 
            className="pr-12 h-12"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <Button size="icon" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={handleSend} disabled={isLoading}>
            <SendHorizonal />
          </Button>
        </div>
      </div>
    </div>
  );
}
