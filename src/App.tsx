// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import ResumeEditor from './components/resume/ResumeEditor';
import ResumePreview from './components/resume/ResumePreview';
import ResumeAIEnhancer from './components/ai/ResumeAIEnhancer';
import AtsChecker from './components/ats/AtsChecker';
import CoverLetterBuilder from './components/cover-letter/CoverLetterBuilder';
import { Button } from './components/ui/button';
import { Tabs, TabsList, TabsTrigger } from './components/ui/tabs';
import { Toaster } from './components/ui/toaster';
import { 
  FileText, 
  FileUp, 
  FilePlus2, 
  Settings, 
  Download, 
  Sparkles, 
  Target,
  Menu,
  X,
  Github
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from './components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './components/ui/dropdown-menu';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKey, setApiKey] = useState('');
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <Sparkles className="h-6 w-6 text-purple-600 mr-2" />
                <span className="font-bold text-xl">Smart Resume AI</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Resume Builder
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/cover-letter" className="flex items-center">
                  <FilePlus2 className="h-4 w-4 mr-2" />
                  Cover Letter
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/ats-checker" className="flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  ATS Checker
                </Link>
              </Button>
              <a href="https://github.com/your-username/smart-resume-ai" target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </Button>
              </a>
            </nav>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="flex flex-col gap-4 mt-8">
                    <Link 
                      to="/" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center p-2 hover:bg-gray-100 rounded-md"
                    >
                      <FileText className="h-5 w-5 mr-2" />
                      Resume Builder
                    </Link>
                    <Link 
                      to="/cover-letter" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center p-2 hover:bg-gray-100 rounded-md"
                    >
                      <FilePlus2 className="h-5 w-5 mr-2" />
                      Cover Letter
                    </Link>
                    <Link 
                      to="/ats-checker" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center p-2 hover:bg-gray-100 rounded-md"
                    >
                      <Target className="h-5 w-5 mr-2" />
                      ATS Checker
                    </Link>
                    <a 
                      href="https://github.com/your-username/smart-resume-ai" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center p-2 hover:bg-gray-100 rounded-md"
                    >
                      <Github className="h-5 w-5 mr-2" />
                      GitHub
                    </a>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="py-6">
        {location.pathname === '/' && (
          <div className="container mx-auto px-4 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h1 className="text-3xl font-bold">Resume Builder</h1>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <FileText className="h-4 w-4 mr-2" />
                      Export as PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileUp className="h-4 w-4 mr-2" />
                      Export as DOCX
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FilePlus2 className="h-4 w-4 mr-2" />
                      Export as TXT
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        )}
        
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { apiKey, onApiKeyChange: setApiKey } as any);
          }
          return child;
        })}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Sparkles className="h-5 w-5 text-purple-600 mr-2" />
              <span className="font-semibold">Smart Resume AI</span>
            </div>
            <div className="text-sm text-gray-500">
              <p>Open source project. Self-hosted for your privacy.</p>
            </div>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a 
                href="https://github.com/your-username/smart-resume-ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Toast notifications */}
      <Toaster />
    </div>
  );
};

const ResumeBuilderPage: React.FC<{ apiKey: string; onApiKeyChange: (key: string) => void }> = ({ 
  apiKey, 
  onApiKeyChange 
}) => {
  return (
    <div className="container mx-auto px-4">
      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="ai">AI Enhancement</TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor">
          <ResumeEditor />
        </TabsContent>
        
        <TabsContent value="preview">
          <ResumePreview />
        </TabsContent>
        
        <TabsContent value="ai">
          <ResumeAIEnhancer apiKey={apiKey} onApiKeyChange={onApiKeyChange} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <MainLayout>
              <ResumeBuilderPage apiKey="" onApiKeyChange={() => {}} />
            </MainLayout>
          } 
        />
        <Route 
          path="/cover-letter" 
          element={
            <MainLayout>
              <CoverLetterBuilder apiKey="" />
            </MainLayout>
          } 
        />
        <Route 
          path="/ats-checker" 
          element={
            <MainLayout>
              <AtsChecker apiKey="" />
            </MainLayout>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;