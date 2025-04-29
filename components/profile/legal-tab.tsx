"use client"

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Code, FileText, Shield, Info } from 'lucide-react'

export default function LegalTab() {
  const [activeTab, setActiveTab] = useState('about')

  return (
    <div className="space-y-6">
      <Tabs defaultValue="about" onValueChange={setActiveTab}>
        <TabsList className="w-full max-w-md mx-auto bg-berkeleyBlue border border-slateBlue/20 rounded-xl p-1 mb-6">
          <TabsTrigger 
            value="about" 
            className="data-[state=active]:bg-richBlack data-[state=active]:text-whiteSmoke rounded-lg flex items-center gap-1.5"
          >
            <Info className="h-4 w-4" />
            <span>About Us</span>
          </TabsTrigger>
          <TabsTrigger 
            value="terms" 
            className="data-[state=active]:bg-richBlack data-[state=active]:text-whiteSmoke rounded-lg flex items-center gap-1.5"
          >
            <FileText className="h-4 w-4" />
            <span>Terms</span>
          </TabsTrigger>
          <TabsTrigger 
            value="privacy" 
            className="data-[state=active]:bg-richBlack data-[state=active]:text-whiteSmoke rounded-lg flex items-center gap-1.5"
          >
            <Shield className="h-4 w-4" />
            <span>Privacy</span>
          </TabsTrigger>
          <TabsTrigger 
            value="cookies" 
            className="data-[state=active]:bg-richBlack data-[state=active]:text-whiteSmoke rounded-lg flex items-center gap-1.5"
          >
            <Code className="h-4 w-4" />
            <span>Cookies</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="about">
          <Card className="p-6 bg-berkeleyBlue/40 backdrop-blur-md border border-slateBlue/20 rounded-xl">
            <div className="space-y-6">
              <h2 className="text-2xl font-comfortaa text-whiteSmoke">About OptimusCode.io</h2>
              
              <div className="bg-richBlack/40 p-5 rounded-xl">
                <p className="text-lightGray mb-4">
                  OptimusCode.io was born from a simple idea: What if creating web applications could be as easy as describing what you want?
                </p>
                
                <h3 className="text-xl font-comfortaa text-whiteSmoke mb-3">Our Mission</h3>
                <p className="text-lightGray mb-6">
                  We believe in democratizing software development by making it accessible to everyone. Our mission is to transform plain text descriptions into production-ready applications, enabling creators to focus on their vision rather than implementation details.
                </p>
                
                <h3 className="text-xl font-comfortaa text-whiteSmoke mb-3">Our Approach</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-slateBlue flex items-center justify-center shrink-0 mt-1">
                      <span className="text-whiteSmoke font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="text-robinEggBlue font-medium mb-1">AI-Powered Understanding</h4>
                      <p className="text-lightGray text-sm">
                        We've developed sophisticated models that interpret user prompts and understand the underlying architecture, features, and functionality needed.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-slateBlue flex items-center justify-center shrink-0 mt-1">
                      <span className="text-whiteSmoke font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="text-robinEggBlue font-medium mb-1">Clean, Modular Design</h4>
                      <p className="text-lightGray text-sm">
                        Every app we generate follows clean architecture principles with modular components, making the code maintainable and extensible.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-slateBlue flex items-center justify-center shrink-0 mt-1">
                      <span className="text-whiteSmoke font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="text-robinEggBlue font-medium mb-1">Ready for Production</h4>
                      <p className="text-lightGray text-sm">
                        We don't just provide code snippets—we deliver complete, working applications with authentication, database integration, and responsive UI.
                      </p>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-comfortaa text-whiteSmoke mb-3">Our Team</h3>
                <p className="text-lightGray mb-4">
                  We're a diverse team of developers, AI researchers, and product designers united by our passion for making software development more accessible and efficient.
                </p>
                <p className="text-lightGray">
                  Founded in 2024, OptimusCode.io is at the forefront of the AI-powered development revolution, constantly pushing the boundaries of what's possible with automated code generation.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="terms">
          <Card className="p-6 bg-berkeleyBlue/40 backdrop-blur-md border border-slateBlue/20 rounded-xl">
            <h2 className="text-2xl font-comfortaa text-whiteSmoke mb-6">Terms of Service</h2>
            
            <div className="space-y-4 text-lightGray">
              <p className="mb-4">
                Last Updated: April 29, 2025
              </p>
              
              <h3 className="text-xl font-comfortaa text-whiteSmoke mb-2">1. Acceptance of Terms</h3>
              <p>
                By accessing or using OptimusCode.io, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
              
              <h3 className="text-xl font-comfortaa text-whiteSmoke mb-2">2. Use License</h3>
              <p>
                You own all rights to the code generated for your account. You may use it for personal or commercial purposes without attribution. However, the OptimusCode.io platform itself, including its algorithms and infrastructure, remains our intellectual property.
              </p>
              
              <h3 className="text-xl font-comfortaa text-whiteSmoke mb-2">3. Usage Limitations</h3>
              <p>
                Your account has usage limitations based on your subscription tier. Attempting to circumvent these limitations may result in account suspension.
              </p>
              
              <h3 className="text-xl font-comfortaa text-whiteSmoke mb-2">4. Prohibited Activities</h3>
              <p>
                You may not use OptimusCode.io to generate applications for illegal purposes, distribution of malware, or projects that violate third-party rights.
              </p>
              
              <h3 className="text-xl font-comfortaa text-whiteSmoke mb-2">5. Service Modifications</h3>
              <p>
                We reserve the right to modify or discontinue any aspect of the service temporarily or permanently without prior notice.
              </p>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy">
          <Card className="p-6 bg-berkeleyBlue/40 backdrop-blur-md border border-slateBlue/20 rounded-xl">
            <h2 className="text-2xl font-comfortaa text-whiteSmoke mb-6">Privacy Policy</h2>
            
            <div className="space-y-4 text-lightGray">
              <p className="mb-4">
                Last Updated: April 29, 2025
              </p>
              
              <h3 className="text-xl font-comfortaa text-whiteSmoke mb-2">1. Information We Collect</h3>
              <p>
                We collect information you provide during account creation and usage, including email address, profile information, and app generation prompts. We also collect usage data to improve our service.
              </p>
              
              <h3 className="text-xl font-comfortaa text-whiteSmoke mb-2">2. How We Use Your Information</h3>
              <p>
                We use your information to provide and improve our services, communicate with you, and enhance your user experience. We may use anonymized prompts to train our AI models.
              </p>
              
              <h3 className="text-xl font-comfortaa text-whiteSmoke mb-2">3. Data Storage</h3>
              <p>
                We store your generated applications and associated data securely. Pro and Enterprise users have extended storage periods for their projects.
              </p>
              
              <h3 className="text-xl font-comfortaa text-whiteSmoke mb-2">4. Third-Party Services</h3>
              <p>
                We use Supabase for authentication and database services. Their privacy policies apply to information stored in their systems.
              </p>
              
              <h3 className="text-xl font-comfortaa text-whiteSmoke mb-2">5. Your Rights</h3>
              <p>
                You have the right to access, correct, or delete your personal information. Contact us to exercise these rights.
              </p>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="cookies">
          <Card className="p-6 bg-berkeleyBlue/40 backdrop-blur-md border border-slateBlue/20 rounded-xl">
            <h2 className="text-2xl font-comfortaa text-whiteSmoke mb-6">Cookies Policy</h2>
            
            <div className="space-y-4 text-lightGray">
              <p className="mb-4">
                Last Updated: April 29, 2025
              </p>
              
              <h3 className="text-xl font-comfortaa text-whiteSmoke mb-2">1. What Are Cookies</h3>
              <p>
                Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience and allow certain features to function properly.
              </p>
              
              <h3 className="text-xl font-comfortaa text-whiteSmoke mb-2">2. Types of Cookies We Use</h3>
              <p>
                We use essential cookies for authentication and session management, functional cookies for remembering your preferences, and analytical cookies to understand how visitors interact with our site.
              </p>
              
              <h3 className="text-xl font-comfortaa text-whiteSmoke mb-2">3. Third-Party Cookies</h3>
              <p>
                Some third-party services we use, such as analytics providers, may place cookies on your device. These cookies are subject to the privacy policies of those providers.
              </p>
              
              <h3 className="text-xl font-comfortaa text-whiteSmoke mb-2">4. Managing Cookies</h3>
              <p>
                Most web browsers allow you to control cookies through their settings. You can choose to block or delete cookies, though this may impact your experience using our website.
              </p>
              
              <h3 className="text-xl font-comfortaa text-whiteSmoke mb-2">5. Changes to This Policy</h3>
              <p>
                We may update our Cookies Policy from time to time. Any changes will be posted on this page with an updated revision date.
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
