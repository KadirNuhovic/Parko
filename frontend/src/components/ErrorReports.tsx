import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, CheckCircle, Clock, XCircle, MapPin } from 'lucide-react';
import { Logo } from './Logo.tsx';

interface ErrorReport {
  id: number;
  title: string;
  description: string;
  type: string;
  status: 'otvoreno' | 'u_procesu' | 'rešeno' | 'odbijeno';
  priority: 'nizak' | 'srednji' | 'visok';
  date: string;
  reporter: string;
  location: string;
}

export const ErrorReports: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [reports] = useState<ErrorReport[]>([
    { 
      id: 1, 
      title: 'Pokvarena ulična rasveta', 
      description: 'Na ulici Kralja Petra I ne radi ulična rasveta već tri nedelje. Problem je posebno izražen tokom noćnih sati što stvara bezbednosni rizik za pešake.', 
      type: 'infrastruktura',
      status: 'otvoreno',
      priority: 'visok',
      date: '15.03.2024.',
      reporter: 'Marko Marković',
      location: 'Ulica Kralja Petra I, Mitrovica'
    },
    { 
      id: 2, 
      title: 'Nedozvoljeno parkiranje', 
      description: 'Vozila se redovno parkiraju na mestima predviđenim za invalide, što otežava pristup osobama sa invaliditetom.', 
      type: 'parking',
      status: 'u_procesu',
      priority: 'srednji',
      date: '14.03.2024.',
      reporter: 'Jelena Jovanović',
      location: 'Trg slobode, Mitrovica'
    },
    { 
      id: 3, 
      title: 'Oštećen putni znak', 
      description: 'Putni znak "STOP" na raskršću ulica Vuka Karadžića i Njegoševa je oštećen i teško se uočava, što dovodi do opasnih situacija u saobraćaju.', 
      type: 'saobraćaj',
      status: 'rešeno',
      priority: 'visok',
      date: '13.03.2024.',
      reporter: 'Milan Petrović',
      location: 'Raskršće Vuka Karadžića i Njegoševa'
    },
    { 
      id: 4, 
      title: 'Pretrpano kontejner za smeće', 
      description: 'Kontejner za smeće u ulici Dositeja Obradovića je stalno pretrpan, smeće se izlijeva na ulicu i stvara loše uslove za život stanovnika.', 
      type: 'usluge',
      status: 'otvoreno',
      priority: 'srednji',
      date: '12.03.2024.',
      reporter: 'Ana Stanković',
      location: 'Ulica Dositeja Obradovića'
    },
    { 
      id: 5, 
      title: 'Pukla pločnika na trotoaru', 
      description: 'Više pločnika na trotoaru je popučeno, što predstavlja opasnost za pešake, posebno za starije osobe i decu.', 
      type: 'infrastruktura',
      status: 'u_procesu',
      priority: 'nizak',
      date: '11.03.2024.',
      reporter: 'Nikola Nikolić',
      location: 'Ulica Svetozara Markovića'
    },
    { 
      id: 6, 
      title: 'Nered na gradskoj pijaci', 
      description: 'Nakon pijčnog dana ostaju velike količine otpada i nereda koji se ne čiste redovno, što utiče na izgled grada.', 
      type: 'usluge',
      status: 'otvoreno',
      priority: 'nizak',
      date: '10.03.2024.',
      reporter: 'Marija Marić',
      location: 'Gradska pijaca, Mitrovica'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Check dark mode from body class
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.body.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    // Listen for changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'rešeno':
        return <CheckCircle className="text-green-600" size={16} />;
      case 'u_procesu':
        return <Clock className="text-yellow-600" size={16} />;
      case 'otvoreno':
        return <Eye className="text-blue-600" size={16} />;
      case 'odbijeno':
        return <XCircle className="text-red-600" size={16} />;
      default:
        return <Eye className="text-gray-600" size={16} />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      'rešeno': 'bg-green-100 text-green-800',
      'u_procesu': 'bg-yellow-100 text-yellow-800',
      'otvoreno': 'bg-blue-100 text-blue-800',
      'odbijeno': 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityClasses = {
      'visok': 'bg-red-100 text-red-800',
      'srednji': 'bg-yellow-100 text-yellow-800',
      'nizak': 'bg-green-100 text-green-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${priorityClasses[priority as keyof typeof priorityClasses]}`}>
        {priority.toUpperCase()}
      </span>
    );
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      'infrastruktura': '🏗️',
      'saobraćaj': '🚗',
      'usluge': '⚡',
      'parking': '🚗'
    };
    return icons[type as keyof typeof icons] || '📍';
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const stats = {
    total: filteredReports.length,
    otvoreno: filteredReports.filter(r => r.status === 'otvoreno').length,
    u_procesu: filteredReports.filter(r => r.status === 'u_procesu').length,
    rešeno: filteredReports.filter(r => r.status === 'rešeno').length,
    odbijeno: filteredReports.filter(r => r.status === 'odbijeno').length
  };

  return (
    <div className={`space-y-4 md:space-y-6 ${isDarkMode ? 'dark' : ''}`}>
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-4 md:p-6 mt-4`}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          {/* Mobile Title */}
          <div className="lg:hidden flex items-center justify-center w-full">
            <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Prijave</h2>
          </div>
          
          {/* Desktop Title */}
          <div className="hidden lg:block">
            <h2 className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Prijave</h2>
          </div>
          
          {/* Desktop Buttons */}
          <div className="hidden lg:flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto">
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-all w-full sm:w-auto shadow-sm"
            >
              <Plus size={18} />
              <span>Nova Prijava</span>
            </button>
          </div>
        </div>
        
        {/* Mobile Buttons */}
        <div className="lg:hidden flex flex-col sm:flex-row gap-2 sm:gap-3 w-full mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-all w-full sm:w-auto shadow-sm"
          >
            <Plus size={18} />
            <span>Nova Prijava</span>
          </button>
        </div>

        {/* Simple Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className={`absolute left-3 top-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} size={18} />
            <input
              type="text"
              placeholder="Pretraži prijave..."
              className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className={`${isDarkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'} p-3 md:p-4 rounded-lg border`}>
            <h3 className={`font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-800'} text-sm md:text-base`}>Otvoreno</h3>
            <p className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {stats.otvoreno}
            </p>
          </div>
          <div className={`${isDarkMode ? 'bg-yellow-900 border-yellow-700' : 'bg-yellow-50 border-yellow-200'} p-3 md:p-4 rounded-lg border`}>
            <h3 className={`font-semibold ${isDarkMode ? 'text-yellow-300' : 'text-yellow-800'} text-sm md:text-base`}>U Procesu</h3>
            <p className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
              {stats.u_procesu}
            </p>
          </div>
          <div className={`${isDarkMode ? 'bg-green-900 border-green-700' : 'bg-green-50 border-green-200'} p-3 md:p-4 rounded-lg border`}>
            <h3 className={`font-semibold ${isDarkMode ? 'text-green-300' : 'text-green-800'} text-sm md:text-base`}>Rešeno</h3>
            <p className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
              {stats.rešeno}
            </p>
          </div>
          <div className={`${isDarkMode ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200'} p-3 md:p-4 rounded-lg border`}>
            <h3 className={`font-semibold ${isDarkMode ? 'text-red-300' : 'text-red-800'} text-sm md:text-base`}>Odbijeno</h3>
            <p className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
              {stats.odbijeno}
            </p>
          </div>
        </div>

        {/* Reports Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((report) => (
            <div key={report.id} className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} rounded-lg p-4 hover:shadow-lg transition-all border`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getTypeIcon(report.type)}</span>
                  <div>
                    <h3 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{report.title}</h3>
                    <p className={`text-xs flex items-center mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <MapPin size={12} className="mr-1" />
                      {report.location}
                    </p>
                  </div>
                </div>
              </div>

              <p className={`text-sm mb-3 line-clamp-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{report.description}</p>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getStatusBadge(report.status)}
                  {getPriorityBadge(report.priority)}
                </div>
                <div className="flex space-x-1">
                  <button className={`p-2 rounded-lg transition-all ${
                    isDarkMode 
                      ? 'text-blue-400 hover:bg-blue-900' 
                      : 'text-blue-600 hover:bg-blue-50'
                  }`}>
                    <Eye size={16} />
                  </button>
                  <button className={`p-2 rounded-lg transition-all ${
                    isDarkMode 
                      ? 'text-green-400 hover:bg-green-900' 
                      : 'text-green-600 hover:bg-green-50'
                  }`}>
                    <Edit size={16} />
                  </button>
                  <button className={`p-2 rounded-lg transition-all ${
                    isDarkMode 
                      ? 'text-red-400 hover:bg-red-900' 
                      : 'text-red-600 hover:bg-red-50'
                  }`}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className={`flex items-center justify-between text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <span>Prijavio: {report.reporter}</span>
                <span>{report.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Report Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-t-3xl w-full max-h-[90vh] overflow-y-auto`}>
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Nova Prijava</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className={`p-2 rounded-lg transition-all ${
                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Naslov</label>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Unesite naslov prijave"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Tip</label>
                    <select className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}>
                      <option value="infrastruktura">Infrastruktura</option>
                      <option value="saobraćaj">Saobraćaj</option>
                      <option value="usluge">Usluge</option>
                      <option value="parking">Parking</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Prioritet</label>
                    <select className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}>
                      <option value="nizak">Nizak</option>
                      <option value="srednji">Srednji</option>
                      <option value="visok">Visok</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Lokacija</label>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Unesite lokaciju"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Opis</label>
                    <textarea
                      className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      rows={4}
                      placeholder="Opišite problem detaljno..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all"
                  >
                    Otkaži
                  </button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all">
                    Pošalji Prijavu
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
