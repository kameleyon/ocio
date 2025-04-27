import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { SendHorizonal } from 'lucide-react';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  loading: boolean;
  initialPrompt?: string;
}

export default function PromptInput({ onSubmit, loading, initialPrompt = '' }: PromptInputProps) {
  const [prompt, setPrompt] = useState(initialPrompt);

  // Update prompt if initialPrompt changes
  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !loading) {
      onSubmit(prompt);
    }
  };

  const placeholders = [
    'Build me a task management tool with login and drag-and-drop Kanban.',
    'Create a blog platform with markdown support and tags.',
    'Make a simple e-commerce store with cart and checkout.',
    'Build a recipe sharing app with search and favorites.',
  ];
  
  const [placeholder, setPlaceholder] = useState(placeholders[0]);
  
  // Rotate through placeholders every 5 seconds
  useEffect(() => {
    if (initialPrompt) return; // Don't rotate if we have an initial prompt

    const interval = setInterval(() => {
      setPlaceholder(prev => {
        const currentIndex = placeholders.indexOf(prev);
        const nextIndex = (currentIndex + 1) % placeholders.length;
        return placeholders[nextIndex];
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, [initialPrompt]);

  return (
    <Card className="w-full rounded-xl border-slateBlue/30 bg-berkeleyBlue/30 p-4 backdrop-blur-md md:p-6">
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <div className="flex-grow">
          <label htmlFor="prompt" className="mb-2 block text-sm font-medium text-lightGray">
            Describe your app
          </label>
          <Input
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={initialPrompt ? '' : placeholder}
            disabled={loading}
            className="border-slateBlue/50 bg-richBlack/50 text-whiteSmoke"
          />
        </div>
        <Button 
          type="submit" 
          className="bg-gradient-to-r from-slateBlue to-robinEggBlue text-whiteSmoke shadow-glow transition-all duration-200 hover:from-slateBlue/90 hover:to-robinEggBlue/90"
          disabled={loading || !prompt.trim()}
        >
          <SendHorizonal className="h-5 w-5" />
          <span className="sr-only">Generate</span>
        </Button>
      </form>
      <p className="mt-2 text-xs text-lightGray">
        Be descriptive about features, design preferences, and functionality.
      </p>
    </Card>
  );
}
