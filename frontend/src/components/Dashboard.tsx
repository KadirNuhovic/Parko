import React, { useState, useEffect } from 'react';
import { Map, AlertCircle, Users, TrendingUp, Plus } from 'lucide-react';
import { Logo } from './Logo.tsx';

export const Dashboard: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Load theme from localStorage or default to false
    const savedTheme = localStorage.getItem('smartMitrovicaTheme');
    return savedTheme === 'dark';
  });

  // Check dark mode from localStorage and body class
  useEffect(() => {
    const checkDarkMode = () => {
      const savedTheme = localStorage.getItem('smartMitrovicaTheme');
      const isDark = savedTheme === 'dark' || document.body.classList.contains('dark');
      setIsDarkMode(isDark);
    };
    
    checkDarkMode();
    
    // Listen for changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  const stats = [
    { title: 'Ukupno Prijava', value: '156', icon: AlertCircle, color: 'bg-red-500', change: '+12%' },
    { title: 'Aktivnih Korisnika', value: '1,234', icon: Users, color: 'bg-blue-500', change: '+8%' },
    { title: 'Lokacije na Mapi', value: '89', icon: Map, color: 'bg-green-500', change: '+5%' },
    { title: 'Rešeno Problema', value: '142', icon: TrendingUp, color: 'bg-purple-500', change: '+23%' },
  ];

  const recentReports = [
    { id: 1, title: 'Popravka ulice', status: 'Otvoreno', date: 'Pre 2 sata', priority: 'Visok', location: 'Ulica glavna 15' },
    { id: 2, title: 'Oštećena rasveta', status: 'U procesu', date: 'Pre 5 sati', priority: 'Srednji', location: 'Blok 2, ulica Sunčana' },
    { id: 3, title: 'Problem sa parkiranjem', status: 'Rešeno', date: 'Pre 1 dana', priority: 'Nizak', location: 'Ulica Školska 8' },
    { id: 4, title: 'Prekid struje', status: 'U procesu', date: 'Pre 3 sata', priority: 'Visok', location: 'Zgrada 5, ulica Partizanska' },
  ];

  const getStatusColor = (status: string) => {
    if (isDarkMode) {
      switch (status) {
        case 'Otvoreno': return 'bg-red-900 text-red-300';
        case 'U procesu': return 'bg-yellow-900 text-yellow-300';
        case 'Rešeno': return 'bg-green-900 text-green-300';
        default: return 'bg-gray-700 text-gray-300';
      }
    } else {
      switch (status) {
        case 'Otvoreno': return 'bg-red-100 text-red-800';
        case 'U procesu': return 'bg-yellow-100 text-yellow-800';
        case 'Rešeno': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    if (isDarkMode) {
      switch (priority) {
        case 'Visok': return 'bg-red-900 text-red-300';
        case 'Srednji': return 'bg-orange-900 text-orange-300';
        case 'Nizak': return 'bg-blue-900 text-blue-300';
        default: return 'bg-gray-700 text-gray-300';
      }
    } else {
      switch (priority) {
        case 'Visok': return 'bg-red-100 text-red-800';
        case 'Srednji': return 'bg-orange-100 text-orange-800';
        case 'Nizak': return 'bg-blue-100 text-blue-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    }
  };

  return (
    <div className={`space-y-4 md:space-y-6 ${isDarkMode ? 'dark' : ''}`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-4 md:p-6 mt-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          {/* Mobile Title */}
          <div className="sm:hidden flex items-center justify-center w-full">
            <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Dashboard</h2>
          </div>
          
          {/* Desktop Title */}
          <div className="hidden sm:block">
            <h2 className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Dashboard</h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Pregled svih prijava i statistika</p>
          </div>
          
          {/* Add Report Button */}
          <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-sm">
            <Plus size={18} />
            <span>Nova Prijava</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} rounded-lg p-4 border hover:shadow-lg transition-all`}>
                <div className="flex items-center justify-between mb-2">
                  <div className={`${stat.color} p-2 rounded-lg`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>{stat.change}</span>
                </div>
                <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{stat.value}</h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>{stat.title}</p>
              </div>
            );
          })}
        </div>

        {/* Recent Reports */}
        <div>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Nedavne Prijave</h3>
          <div className="space-y-3">
            {recentReports.map((report) => (
              <div key={report.id} className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} rounded-lg p-4 border hover:shadow-lg transition-all`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1">
                    <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{report.title}</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>{report.location}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(report.priority)}`}>
                      {report.priority}
                    </span>
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{report.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
