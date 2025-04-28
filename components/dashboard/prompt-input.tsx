import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { SendHorizonal, CornerDownLeft, Sparkles } from 'lucide-react';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  loading: boolean;
  initialPrompt?: string;
}

export default function PromptInput({ onSubmit, loading, initialPrompt = '' }: PromptInputProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [cursorVisible, setCursorVisible] = useState(true);

  const placeholders = [
    'Build me a task management tool with login and drag-and-drop Kanban.',
    'Create a blog platform with markdown support and tags.',
    'Make a recipe sharing app with search and favorites.',
    'Build a fitness tracking app with progress charts.',
    'Design a portfolio website with project showcase.',
  ];

  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
      setIsTyping(false);
      return;
    }

    let timeout: NodeJS.Timeout;
    let typingInterval: NodeJS.Timeout;
    let currentPlaceholder = placeholders[currentPlaceholderIndex];
    let currentChar = 0;

    // Start typing effect
    if (isTyping) {
      typingInterval = setInterval(() => {
        if (currentChar < currentPlaceholder.length) {
          setDisplayedPlaceholder(currentPlaceholder.substring(0, currentChar + 1));
          currentChar++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          
          // After typing is done, wait 3 seconds before erasing
          timeout = setTimeout(() => {
            setIsTyping(true);
            // Reset for erasing
            currentChar = currentPlaceholder.length;
            
            // Start erasing effect
            typingInterval = setInterval(() => {
              if (currentChar > 0) {
                setDisplayedPlaceholder(currentPlaceholder.substring(0, currentChar - 1));
                currentChar--;
              } else {
                clearInterval(typingInterval);
                
                // Move to next placeholder
                const nextIndex = (currentPlaceholderIndex + 1) % placeholders.length;
                setCurrentPlaceholderIndex(nextIndex);
                setIsTyping(true);
              }
            }, 30); // Erase faster than typing
          }, 3000);
        }
      }, 50);
    }

    // Cursor blinking effect
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
      clearTimeout(timeout);
    };
  }, [initialPrompt, currentPlaceholderIndex, isTyping, placeholders]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !loading) {
      onSubmit(prompt);
    }
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  return (
    <Card className="w-full rounded-xl border-slateBlue/30 bg-berkeleyBlue/30 p-4 backdrop-blur-md md:p-6">
      <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-whiteSmoke">
        <Sparkles className="h-4 w-4 text-robinEggBlue" />
        Describe your app in detail
      </p>
      
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <div className="flex-grow relative">
          <Input
            value={prompt}
            onChange={handlePromptChange}
            placeholder={initialPrompt ? '' : 'Type your app description...'}
            disabled={loading}
            className="pr-24 border-slateBlue/50 bg-richBlack/50 text-whiteSmoke h-12 text-base"
          />
          
          {!prompt && !initialPrompt && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-lightGray/70 font-light">
              {displayedPlaceholder}
              {cursorVisible && <span className="text-robinEggBlue">|</span>}
            </div>
          )}
          
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-lightGray/70">
            <CornerDownLeft className="h-3.5 w-3.5" />
            <span>to submit</span>
          </div>
        </div>
        <Button 
          type="submit" 
          className="h-12 px-4 bg-gradient-to-r from-slateBlue to-robinEggBlue text-whiteSmoke shadow-glow transition-all duration-200 hover:from-slateBlue/90 hover:to-robinEggBlue/90"
          disabled={loading || !prompt.trim()}
        >
          {loading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent border-whiteSmoke" />
          ) : (
            <SendHorizonal className="h-5 w-5" />
          )}
          <span className="ml-2">{loading ? 'Generating...' : 'Generate'}</span>
        </Button>
      </form>
      
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs text-lightGray">Examples:</span>
        {['E-commerce', 'Blog', 'Dashboard', 'Social app'].map((example) => (
          <button
            key={example}
            type="button"
            className="rounded-full border border-slateBlue/30 bg-richBlack/30 px-3 py-1 text-xs text-lightGray hover:bg-slateBlue/20 hover:text-whiteSmoke transition-colors"
            onClick={() => {
              const examplePrompts: Record<string, string> = {
                'E-commerce': 'Create an e-commerce platform with product listings, shopping cart, and checkout process. Include user authentication and payment integration.',
                'Blog': 'Build a blog platform with article listings, categories, and comments. Include a markdown editor and user authentication.',
                'Dashboard': 'Develop an analytics dashboard with charts, tables, and filters. Include user authentication and data visualization tools.',
                'Social app': 'Design a social media app with user profiles, posts, likes, and comments. Include authentication and real-time notifications.'
              };
              setPrompt(examplePrompts[example] || '');
            }}
            disabled={loading}
          >
            {example}
          </button>
        ))}
      </div>
    </Card>
  );
}
