"use client"

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, MessageSquare, HelpCircle, Send } from 'lucide-react'

// Mock FAQ data
const FAQs = [
  {
    question: "How does OptimusCode.io generate apps?",
    answer: "OptimusCode.io uses advanced AI to analyze your prompt and convert it into a structured plan. It identifies the features, architecture, and tech stack needed, then generates the code, database schema, and UI components automatically."
  },
  {
    question: "What tech stacks are supported?",
    answer: "We support React, Next.js, and Vue for frontend; Node.js, Express for backend; and Supabase, MongoDB, or PostgreSQL for databases. More stacks are continually being added to our supported technologies."
  },
  {
    question: "Can I customize the generated app?",
    answer: "Yes! All generated apps come with clean, well-documented code that you can modify. The app structure follows industry best practices, making it easy to extend and customize to your specific needs."
  },
  {
    question: "What happens if the generated app doesn't match my requirements?",
    answer: "You can regenerate the app with a more detailed prompt or modify specific aspects. Our AI learns from feedback, so each generation improves. Pro and Enterprise users can also request targeted regeneration of specific components."
  },
  {
    question: "Do I own the code that's generated?",
    answer: "Absolutely. You have full ownership rights to all code generated for your account. You can use it for personal or commercial projects without any licensing constraints."
  },
  {
    question: "How do I deploy my generated app?",
    answer: "Each app comes with deployment instructions for popular platforms like Vercel, Netlify, Heroku, and more. The README.md file in your downloaded package provides step-by-step deployment guides."
  },
  {
    question: "What's the difference between tiers?",
    answer: "Free tier includes basic app generation with limited features and tech stacks. Pro tier adds more complex app types, advanced features, and priority generation. Enterprise tier offers unlimited generations, all premium features, and dedicated support."
  },
]

export default function HelpTab() {
  const [activeTab, setActiveTab] = useState('faq')
  const [searchQuery, setSearchQuery] = useState('')
  const [chatMessages, setChatMessages] = useState<Array<{from: 'user' | 'system', text: string}>>([
    {from: 'system', text: 'Hello! How can I help you with OptimusCode.io today?'}
  ])
  const [newMessage, setNewMessage] = useState('')

  // Filter FAQs based on search query
  const filteredFAQs = searchQuery 
    ? FAQs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : FAQs

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    
    // Add user message
    setChatMessages([...chatMessages, {from: 'user', text: newMessage}])
    
    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        from: 'system', 
        text: "Thank you for your question. Our support team has been notified and will respond shortly. In the meantime, you might find an answer in our FAQ section."
      }])
    }, 1000)
    
    setNewMessage('')
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="faq" onValueChange={setActiveTab}>
        <TabsList className="w-full max-w-md mx-auto bg-berkeleyBlue border border-slateBlue/20 rounded-xl p-1 mb-6">
          <TabsTrigger 
            value="faq" 
            className="data-[state=active]:bg-richBlack data-[state=active]:text-whiteSmoke rounded-lg flex items-center gap-1.5"
          >
            <HelpCircle className="h-4 w-4" />
            <span>FAQ</span>
          </TabsTrigger>
          <TabsTrigger 
            value="chat" 
            className="data-[state=active]:bg-richBlack data-[state=active]:text-whiteSmoke rounded-lg flex items-center gap-1.5"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Help Desk</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="faq">
          <Card className="p-6 bg-berkeleyBlue/40 backdrop-blur-md border border-slateBlue/20 rounded-xl">
            <div className="flex items-center gap-2 mb-6">
              <Search className="h-5 w-5 text-slateBlue" />
              <Input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-richBlack/60 border-slateBlue/30 text-whiteSmoke placeholder:text-lightGray"
              />
            </div>
            
            <div className="space-y-4">
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map((faq, index) => (
                  <div key={index} className="border-b border-slateBlue/20 pb-4 last:border-0">
                    <h3 className="font-comfortaa font-semibold text-whiteSmoke mb-2">{faq.question}</h3>
                    <p className="text-lightGray text-sm">{faq.answer}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-lightGray py-4">No results found. Try a different search term.</p>
              )}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="chat">
          <Card className="p-6 bg-berkeleyBlue/40 backdrop-blur-md border border-slateBlue/20 rounded-xl">
            <div className="flex flex-col h-[400px]">
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 bg-richBlack/40 rounded-lg">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        msg.from === 'user'
                          ? 'bg-slateBlue text-whiteSmoke'
                          : 'bg-berkeleyBlue/60 text-lightGray'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Type your question here..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="bg-richBlack/60 border-slateBlue/30 text-whiteSmoke placeholder:text-lightGray"
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-slateBlue hover:bg-slateBlue/80 text-whiteSmoke"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
