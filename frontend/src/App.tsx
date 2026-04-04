import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Dashboard } from './components/Dashboard.tsx';
import { MapView } from './components/MapView.tsx';
import { ErrorReports } from './components/ErrorReports.tsx';
import { AccountSettings } from './components/AccountSettings.tsx';
import { ComingSoon } from './components/ComingSoon.tsx';
import { ParkingCheckIn } from './components/ParkingCheckIn.tsx';
import SubscriptionPlans from './components/SubscriptionPlans.tsx';
import { SubscriptionProvider } from './components/SubscriptionContext.tsx';
import { ThemeProvider, useTheme } from './components/ThemeContext.tsx';
import { LoadingScreen } from './components/LoadingScreen.tsx';
import { Menu, X, Map, Home, AlertTriangle, Settings, Globe, Sun, Moon, Car, Crown } from 'lucide-react';
import { Logo } from './components/Logo.tsx';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(() => {
    // Load language from localStorage or default to 'sr'
    const savedLang = localStorage.getItem('smartMitrovicaLang');
    return savedLang || 'sr';
  });
  const [isLoading, setIsLoading] = useState(true);

  const translations: Record<string, Record<string, Record<string, string>>> = {
    sr: {
      menu: {
        map: 'Mapa',
        dashboard: 'Dashboard',
        parking: 'Parking',
        reports: 'Prijave',
        subscription: 'Planovi',
        settings: 'Podešavanja',
        comingSoon: 'Coming Soon'
      },
      user: {
        profile: 'Profil',
        email: 'Email'
      },
      common: {
        save: 'Sačuvaj',
        cancel: 'Otkaži',
        add: 'Dodaj',
        search: 'Pretraži',
        filter: 'Filter',
        loading: 'Učitavanje...',
        noData: 'Nema podataka',
        error: 'Greška',
        success: 'Uspešno'
      }
    },
    en: {
      menu: {
        map: 'Map',
        dashboard: 'Dashboard',
        parking: 'Parking',
        reports: 'Reports',
        subscription: 'Plans',
        settings: 'Settings',
        comingSoon: 'Coming Soon'
      },
      user: {
        profile: 'Profile',
        email: 'Email'
      },
      common: {
        save: 'Save',
        cancel: 'Cancel',
        add: 'Add',
        search: 'Search',
        filter: 'Filter',
        loading: 'Loading...',
        noData: 'No data',
        error: 'Error',
        success: 'Success'
      }
    }
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[currentLang];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  const languages = [
    { code: 'sr', name: 'Srpski', flag: '🇷🇸' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ];

  const menuItems = [
    { path: '/map', label: t('menu.map'), icon: Map },
    { path: '/dashboard', label: t('menu.dashboard'), icon: Home },
    { path: '/parking', label: t('menu.parking'), icon: Car },
    { path: '/subscription', label: t('menu.subscription'), icon: Crown },
    { path: '/error-reports', label: t('menu.reports'), icon: AlertTriangle },
    { path: '/coming-soon', label: t('menu.comingSoon'), icon: Globe },
    { path: '/account-settings', label: t('menu.settings'), icon: Settings },
  ];

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('smartMitrovicaLang', currentLang);
  }, [currentLang]);

  return (
    <ThemeProvider>
      {isLoading ? (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      ) : (
        <AppContent 
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          currentLang={currentLang}
          setCurrentLang={setCurrentLang}
          t={t}
          languages={languages}
          menuItems={menuItems}
        />
      )}
    </ThemeProvider>
  );
}

function AppContent({ 
  isSidebarOpen, 
  setIsSidebarOpen, 
  currentLang, 
  setCurrentLang, 
  t, 
  languages, 
  menuItems 
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean) => void;
  currentLang: string;
  setCurrentLang: (value: string) => void;
  t: (key: string) => string;
  languages: { code: string; name: string; flag: string }[];
  menuItems: { path: string; label: string; icon: any }[];
}) {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <SubscriptionProvider>
      <Router basename="/">
        <div className={`flex h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} overflow-hidden`}>
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-40 w-72 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="flex flex-col h-full">
            {/* Logo Section */}
            <div className={`p-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
              <Logo size="medium" />
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4 space-y-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isLastItem = index === menuItems.length - 1;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-blue-400' 
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    } ${isLastItem ? 'mt-auto border-t pt-6 ' + (isDarkMode ? 'border-gray-700' : 'border-gray-200') : ''}`}
                  >
                    <Icon size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Section */}
            <div className={`p-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-t`}>
              <div className={`flex items-center space-x-3 p-3 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">MM</span>
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Marko Marković</p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>marko@example.com</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <header className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b px-6 py-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className={`lg:hidden p-2 rounded-lg transition-all ${
                    isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-white hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
              
              {/* Center Logo - Mobile Only */}
              <div className="lg:hidden absolute left-1/2 transform -translate-x-1/2">
                <Logo size="small" showText={false} />
              </div>
              
              {/* Desktop Title */}
              <div className="hidden lg:block">
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {(window.location.pathname === '/' || window.location.pathname === '/map') && t('menu.map')}
                  {window.location.pathname === '/dashboard' && t('menu.dashboard')}
                  {window.location.pathname === '/parking' && t('menu.parking')}
                  {window.location.pathname === '/subscription' && t('menu.subscription')}
                  {window.location.pathname === '/error-reports' && t('menu.reports')}
                  {window.location.pathname === '/account-settings' && t('menu.settings')}
                </h2>
              </div>
              
              {/* Right Actions */}
              <div className="flex items-center space-x-2">
                {/* Language Selector - Mobile Only */}
                <div className="lg:hidden">
                  <select 
                    value={currentLang} 
                    onChange={(e) => setCurrentLang(e.target.value)}
                    className={`px-1 py-1 text-xs border rounded focus:outline-none focus:ring-1 transition-all ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-gray-300 focus:ring-blue-500' 
                        : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500'
                    }`}
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Dark Mode Toggle */}
                <button
                  onClick={() => toggleDarkMode()}
                  className={`p-1.5 rounded-full transition-all ${
                    isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                
                {/* Language Selector - Desktop Only */}
                <div className="hidden lg:block">
                  <button className={`p-1.5 rounded-full transition-all relative group ${
                    isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}>
                    <Globe size={18} />
                    <div className={`absolute top-full right-0 mt-1 w-24 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 ${
                      isDarkMode ? 'bg-gray-800' : 'bg-white'
                    }`}>
                      {languages.map(lang => (
                        <button
                          key={lang.code}
                          onClick={() => setCurrentLang(lang.code)}
                          className={`w-full px-2 py-1.5 text-left flex items-center justify-center first:rounded-t-lg last:rounded-b-lg transition-all ${
                            isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <span className="text-lg">{lang.flag}</span>
                        </button>
                      ))}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className={`flex-1 overflow-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <Routes>
              <Route path="/" element={<MapView />} />
              <Route path="/map" element={<Navigate to="/" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/parking" element={<ParkingCheckIn />} />
              <Route path="/subscription" element={<SubscriptionPlans />} />
              <Route path="/error-reports" element={<ErrorReports />} />
              <Route path="/account-settings" element={<AccountSettings />} />
              <Route path="/coming-soon" element={<ComingSoon />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
    </SubscriptionProvider>
  );
}

export default App;
