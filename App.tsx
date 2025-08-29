
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MetaTagGenerator from './components/MetaTagGenerator';
import SerpPreview from './components/SerpPreview';
import KeywordDensityChecker from './components/KeywordDensityChecker';
import FileGenerator from './components/FileGenerator';
import CompetitorResearch from './components/CompetitorResearch';
import BacklinkChecker from './components/BacklinkChecker';
import OnPageAnalyzer from './components/OnPageAnalyzer';
import LighthouseReport from './components/LighthouseReport';
import ContentGapAnalysis from './components/ContentGapAnalysis';
import PaaExtractor from './components/PaaExtractor';
import SearchIntentClassifier from './components/SearchIntentClassifier';
import ContentBriefBuilder from './components/ContentBriefBuilder';
import AuthControls from './components/AuthControls';
import AuthModal from './components/AuthModal';
import AuthGate from './components/AuthGate';
import AdminPanel from './components/AdminPanel';
import PendingApproval from './components/PendingApproval';
import { Tool, User } from './types';
import * as db from './services/databaseService';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<Tool>(Tool.META_TAGS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    // Ensure the default admin user exists and is up-to-date on app start.
    db.initializeAdminUser();
    
    // Check for a logged-in user in the session.
    const user = db.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      if (user.role === 'admin') {
        setActiveTool(Tool.ADMIN_PANEL);
      }
    }
  }, []);

  const handleSignup = async (email: string, pass: string): Promise<void> => {
    const user = await db.signup(email, pass);
    setCurrentUser(user);
  };

  const handleLogin = async (email: string, pass: string): Promise<void> => {
    const user = await db.login(email, pass);
    setCurrentUser(user);
    if (user.role === 'admin') {
      setActiveTool(Tool.ADMIN_PANEL);
    } else {
      setActiveTool(Tool.META_TAGS);
    }
  };

  const handleGoogleSignIn = (credentialResponse: any) => {
    try {
      const user = db.upsertUserFromGoogle(credentialResponse);
      setCurrentUser(user);
      setIsAuthModalOpen(false);
       if (user.role === 'admin') {
        setActiveTool(Tool.ADMIN_PANEL);
      }
    } catch (error) {
        console.error("Google Sign-In Error:", error);
    }
  };

  const handleLogout = () => {
    db.logout();
    setCurrentUser(null);
    setActiveTool(Tool.META_TAGS);
  };

  const openModal = (mode: 'login' | 'signup') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const renderTool = () => {
    // These checks should always be against the current user state
    if (!currentUser) return null;

    if (!currentUser.isApproved) {
        return <PendingApproval />;
    }

    if (currentUser.role !== 'admin' && !currentUser.approvedTools.includes(activeTool)) {
      return (
        <div className="flex items-center justify-center h-full text-center">
          <div className="bg-brand-dark-light p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-red-400">Access Denied</h2>
            <p className="text-brand-gray mt-2">You do not have permission to use this tool.</p>
          </div>
        </div>
      );
    }

    switch (activeTool) {
      case Tool.META_TAGS: return <MetaTagGenerator />;
      case Tool.SERP_PREVIEW: return <SerpPreview />;
      case Tool.KEYWORD_DENSITY: return <KeywordDensityChecker />;
      case Tool.FILE_GENERATOR: return <FileGenerator />;
      case Tool.COMPETITOR_RESEARCH: return <CompetitorResearch />;
      case Tool.BACKLINK_CHECKER: return <BacklinkChecker />;
      case Tool.ON_PAGE_ANALYZER: return <OnPageAnalyzer />;
      case Tool.LIGHTHOUSE_REPORT: return <LighthouseReport />;
      case Tool.CONTENT_GAP: return <ContentGapAnalysis />;
      case Tool.PAA_EXTRACTOR: return <PaaExtractor />;
      case Tool.SEARCH_INTENT: return <SearchIntentClassifier />;
      case Tool.CONTENT_BRIEF: return <ContentBriefBuilder />;
      case Tool.ADMIN_PANEL:
        return currentUser.role === 'admin' ? <AdminPanel /> : <MetaTagGenerator />;
      default: return <MetaTagGenerator />;
    }
  };
  
  const renderContent = () => {
    if (!currentUser) {
        return <AuthGate onLoginClick={() => openModal('login')} onSignupClick={() => openModal('signup')} />;
    }
    return renderTool();
  }

  return (
    <div className="flex min-h-screen bg-brand-dark text-brand-light font-sans">
      <Sidebar activeTool={activeTool} setActiveTool={setActiveTool} currentUser={currentUser} />
      <main className="flex-1 p-6 md:p-10 pt-20 md:pt-10 relative">
        <AuthControls
          currentUser={currentUser}
          onLoginClick={() => openModal('login')}
          onSignupClick={() => openModal('signup')}
          onLogoutClick={handleLogout}
        />
        {renderContent()}
      </main>

      {isAuthModalOpen && (
        <AuthModal 
          mode={authModalMode}
          onClose={() => setIsAuthModalOpen(false)}
          onLogin={handleLogin}
          onSignup={handleSignup}
          onGoogleSignIn={handleGoogleSignIn}
        />
      )}
    </div>
  );
};

export default App;
