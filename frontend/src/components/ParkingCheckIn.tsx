import React, { useState, useEffect, useMemo } from 'react';
import { Car, Clock, CheckCircle, Circle, Navigation, Search, Filter, DollarSign, Star, X, Bell, BarChart3, Calendar } from 'lucide-react';

interface ParkingSession {
  id: string;
  zoneId: number;
  zoneName: string;
  checkInTime: Date;
  checkOutTime?: Date;
  isActive: boolean;
  plateNumber: string;
  duration?: number;
  cost?: number;
}

interface ParkingZone {
  id: number;
  name: string;
  totalSpaces: number;
  occupiedSpaces: number;
  lat: number;
  lng: number;
  pricePerHour: number;
  rating: number;
  distance?: number;
  features: string[];
}

interface ParkingStats {
  totalSessions: number;
  totalDuration: number;
  totalCost: number;
  favoriteZone: string;
  averageDuration: number;
}

export const ParkingCheckIn: React.FC<{ t?: (key: string) => string }> = ({ t }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('smartMitrovicaTheme');
    return savedTheme === 'dark';
  });

  const [activeSession, setActiveSession] = useState<ParkingSession | null>(null);
  const [plateNumber, setPlateNumber] = useState('');
  const [selectedZone, setSelectedZone] = useState<ParkingZone | null>(null);
  const [parkingHistory, setParkingHistory] = useState<ParkingSession[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('distance');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  // Enhanced parking zones with more data
  const parkingZones: ParkingZone[] = useMemo(() => [
    { 
      id: 1, 
      name: 'Parking Centar', 
      totalSpaces: 50, 
      occupiedSpaces: 25, 
      lat: 42.8893, 
      lng: 20.8731,
      pricePerHour: 100,
      rating: 4.5,
      features: ['Pokriven', '24/7', 'Video nadzor']
    },
    { 
      id: 2, 
      name: 'Parking Tehnički Fakultet', 
      totalSpaces: 30, 
      occupiedSpaces: 15, 
      lat: 42.9000, 
      lng: 20.8600,
      pricePerHour: 80,
      rating: 4.2,
      features: ['Pokriven', 'Studentski popust']
    },
    { 
      id: 3, 
      name: 'Parking Bolnica', 
      totalSpaces: 40, 
      occupiedSpaces: 35, 
      lat: 42.8980, 
      lng: 20.8680,
      pricePerHour: 60,
      rating: 3.8,
      features: ['24/7', 'Invalidska mesta']
    },
    { 
      id: 4, 
      name: 'Parking Knez', 
      totalSpaces: 25, 
      occupiedSpaces: 5, 
      lat: 42.9050, 
      lng: 20.8620,
      pricePerHour: 120,
      rating: 4.7,
      features: ['Centar', 'Pokriven']
    },
    { 
      id: 5, 
      name: 'Parking Krugni Tok Sever', 
      totalSpaces: 60, 
      occupiedSpaces: 48, 
      lat: 42.9080, 
      lng: 20.8700,
      pricePerHour: 50,
      rating: 3.9,
      features: ['Veliki kapacitet', 'Besplatan prvih 2h']
    },
    { 
      id: 6, 
      name: 'Parking Tržni Centar', 
      totalSpaces: 80, 
      occupiedSpaces: 20, 
      lat: 42.8920, 
      lng: 20.8750,
      pricePerHour: 0,
      rating: 4.3,
      features: ['Besplatan', 'Pokriven', 'Shopping popust']
    },
    { 
      id: 7, 
      name: 'Parking Stadion', 
      totalSpaces: 100, 
      occupiedSpaces: 70, 
      lat: 42.8960, 
      lng: 20.8780,
      pricePerHour: 40,
      rating: 4.0,
      features: ['Dogadjaji', 'Veliki kapacitet']
    },
    { 
      id: 8, 
      name: 'Parking Železnička Stanica', 
      totalSpaces: 35, 
      occupiedSpaces: 28, 
      lat: 42.8850, 
      lng: 20.8800,
      pricePerHour: 70,
      rating: 3.7,
      features: ['Pristup putnicima', '24/7']
    },
    { 
      id: 9, 
      name: 'Parking Škola', 
      totalSpaces: 20, 
      occupiedSpaces: 8, 
      lat: 42.9020, 
      lng: 20.8650,
      pricePerHour: 0,
      rating: 4.1,
      features: ['Besplatan', 'Vikend popust']
    },
    { 
      id: 10, 
      name: 'Parking Opština', 
      totalSpaces: 45, 
      occupiedSpaces: 40, 
      lat: 42.8870, 
      lng: 20.8710,
      pricePerHour: 90,
      rating: 4.4,
      features: ['Administrativni centar', 'Pokriven']
    }
  ], []);

  // Calculate parking statistics
  const parkingStats: ParkingStats = useMemo(() => {
    const totalSessions = parkingHistory.length;
    const totalDuration = parkingHistory.reduce((sum, session) => {
      const duration = session.checkOutTime 
        ? (session.checkOutTime.getTime() - session.checkInTime.getTime()) / 1000 / 60
        : 0;
      return sum + duration;
    }, 0);
    
    const totalCost = parkingHistory.reduce((sum, session) => sum + (session.cost || 0), 0);
    const averageDuration = totalSessions > 0 ? totalDuration / totalSessions : 0;
    
    const zoneCounts = parkingHistory.reduce((acc, session) => {
      acc[session.zoneName] = (acc[session.zoneName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const favoriteZone = Object.keys(zoneCounts).reduce((a, b) => 
      zoneCounts[a] > zoneCounts[b] ? a : b, '');

    return {
      totalSessions,
      totalDuration,
      totalCost,
      favoriteZone,
      averageDuration
    };
  }, [parkingHistory]);

  // Filter and sort parking zones
  const filteredAndSortedZones = useMemo(() => {
    let filtered = parkingZones.filter(zone => 
      zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      zone.features.some(f => f.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (selectedFilter !== 'all') {
      switch (selectedFilter) {
        case 'free':
          filtered = filtered.filter(z => z.pricePerHour === 0);
          break;
        case 'covered':
          filtered = filtered.filter(z => z.features.includes('Pokriven'));
          break;
        case '24/7':
          filtered = filtered.filter(z => z.features.includes('24/7'));
          break;
        case 'available':
          filtered = filtered.filter(z => (z.totalSpaces - z.occupiedSpaces) >= 5);
          break;
      }
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.pricePerHour - b.pricePerHour;
        case 'rating':
          return b.rating - a.rating;
        case 'availability':
          return (b.totalSpaces - b.occupiedSpaces) - (a.totalSpaces - a.occupiedSpaces);
        case 'distance':
        default:
          return (a.distance || 0) - (b.distance || 0);
      }
    });
  }, [parkingZones, searchTerm, selectedFilter, sortBy]);

  useEffect(() => {
    const checkDarkMode = () => {
      const savedTheme = localStorage.getItem('smartMitrovicaTheme');
      const isDark = savedTheme === 'dark' || document.body.classList.contains('dark');
      setIsDarkMode(isDark);
    };
    
    checkDarkMode();
    
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Učitaj aktivnu sesiju iz localStorage
  useEffect(() => {
    const savedSession = localStorage.getItem('activeParkingSession');
    if (savedSession) {
      const session = JSON.parse(savedSession);
      setActiveSession({
        ...session,
        checkInTime: new Date(session.checkInTime),
        checkOutTime: session.checkOutTime ? new Date(session.checkOutTime) : undefined
      });
    }

    const savedHistory = localStorage.getItem('parkingHistory');
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      setParkingHistory(history.map((h: any) => ({
        ...h,
        checkInTime: new Date(h.checkInTime),
        checkOutTime: h.checkOutTime ? new Date(h.checkOutTime) : undefined
      })));
    }
  }, []);

  const addNotification = (message: string) => {
    const newNotification = `${currentTime.toLocaleTimeString('sr-RU', { hour: '2-digit', minute: '2-digit' })} - ${message}`;
    setNotifications(prev => [newNotification, ...prev].slice(0, 5));
  };

  const handleCheckIn = () => {
    if (!plateNumber.trim() || !selectedZone) {
      alert('Molimo unesite registarske tablice i izaberite parking zonu');
      return;
    }

    const session: ParkingSession = {
      id: Date.now().toString(),
      zoneId: selectedZone.id,
      zoneName: selectedZone.name,
      checkInTime: new Date(),
      isActive: true,
      plateNumber: plateNumber.toUpperCase()
    };

    setActiveSession(session);
    localStorage.setItem('activeParkingSession', JSON.stringify(session));
    addNotification(`✅ Uspešno ste se parkirali u ${selectedZone.name}`);
    
    setPlateNumber('');
    setSelectedZone(null);
  };

  const handleCheckOut = () => {
    if (!activeSession) return;

    const zone = parkingZones.find(z => z.id === activeSession.zoneId);
    const duration = (new Date().getTime() - activeSession.checkInTime.getTime()) / 1000 / 60 / 60; // hours
    const cost = zone ? Math.ceil(duration * zone.pricePerHour) : 0;

    const completedSession = {
      ...activeSession,
      checkOutTime: new Date(),
      isActive: false,
      duration,
      cost
    };

    const updatedHistory = [completedSession, ...parkingHistory];
    setParkingHistory(updatedHistory);
    localStorage.setItem('parkingHistory', JSON.stringify(updatedHistory));

    setActiveSession(null);
    localStorage.removeItem('activeParkingSession');
    
    addNotification(`✅ Parking završen. Cena: ${cost} RSD`);
  };

  const formatDuration = (startTime: Date, endTime?: Date) => {
    const end = endTime || new Date();
    const duration = Math.floor((end.getTime() - startTime.getTime()) / 1000 / 60); // minuta
    
    if (duration < 60) {
      return `${duration} min`;
    } else {
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      return `${hours}h ${minutes}min`;
    }
  };

  const getOccupancyColor = (occupied: number, total: number) => {
    const percentage = (occupied / total) * 100;
    if (percentage <= 20) return isDarkMode ? 'text-green-400' : 'text-green-600';
    if (percentage <= 80) return isDarkMode ? 'text-yellow-400' : 'text-yellow-600';
    return isDarkMode ? 'text-red-400' : 'text-red-600';
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Pronađi najbližu parking zonu
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          
          let nearestZone = parkingZones[0];
          let minDistance = Infinity;
          
          parkingZones.forEach(zone => {
            const distance = Math.sqrt(
              Math.pow(zone.lat - userLat, 2) + Math.pow(zone.lng - userLng, 2)
            );
            if (distance < minDistance) {
              minDistance = distance;
              nearestZone = zone;
            }
          });
          
          setSelectedZone(nearestZone);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Ne mogu da dobijem vašu lokaciju');
        }
      );
    }
  };

  return (
    <div className={`h-full w-full flex flex-col ${isDarkMode ? 'dark' : ''}`}>
      {/* Enhanced Header */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b p-4 lg:p-6 flex-shrink-0 mt-4`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className={`text-xl lg:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} flex items-center gap-2`}>
              <Car className="text-blue-500" />
              {t ? t('parking.checkIn') : 'Parking Centar'}
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
              {t ? t('parking.checkInDesc') : 'Pametno parkiranje za vaš grad'}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <Clock size={16} />
              <span className="text-sm font-medium">
                {currentTime.toLocaleTimeString('sr-RU', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-2 rounded-lg transition-all ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <Bell size={18} />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className={`absolute top-20 right-4 z-50 w-80 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-lg border p-4`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Notifikacije</h3>
            <button onClick={() => setShowNotifications(false)}>
              <X size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
            </button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Nema novih notifikacija</p>
            ) : (
              notifications.map((notif, index) => (
                <div key={index} className={`text-sm p-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  {notif}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Statistics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-xl shadow-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Ukupno Sesionija</p>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {parkingStats.totalSessions}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                  <BarChart3 className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} size={20} />
                </div>
              </div>
            </div>

            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-xl shadow-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Ukupno Cena</p>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {parkingStats.totalCost} RSD
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-green-900' : 'bg-green-100'}`}>
                  <DollarSign className={isDarkMode ? 'text-green-400' : 'text-green-600'} size={20} />
                </div>
              </div>
            </div>

            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-xl shadow-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Prosečno Trajanje</p>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {Math.round(parkingStats.averageDuration)}min
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-purple-900' : 'bg-purple-100'}`}>
                  <Clock className={isDarkMode ? 'text-purple-400' : 'text-purple-600'} size={20} />
                </div>
              </div>
            </div>

            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-xl shadow-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Omiljena Zona</p>
                  <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {parkingStats.favoriteZone || 'N/A'}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-yellow-900' : 'bg-yellow-100'}`}>
                  <Star className={isDarkMode ? 'text-yellow-400' : 'text-yellow-600'} size={20} />
                </div>
              </div>
            </div>
          </div>

          {/* Active Session */}
          {activeSession ? (
            <div className={`${isDarkMode ? 'bg-gradient-to-r from-green-900 to-green-800' : 'bg-gradient-to-r from-green-50 to-green-100'} p-6 rounded-xl border ${isDarkMode ? 'border-green-700' : 'border-green-200'}`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${isDarkMode ? 'bg-green-800' : 'bg-green-200'}`}>
                    <CheckCircle className={isDarkMode ? 'text-green-300' : 'text-green-600'} size={24} />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-green-300' : 'text-green-800'}`}>
                      Aktivna Parking Sesija
                    </h3>
                    <p className={`${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                      {activeSession.zoneName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCheckOut}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all transform hover:scale-105 flex items-center space-x-2 shadow-lg"
                >
                  <Circle size={20} />
                  <span className="font-semibold">Završi Parking</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-green-800' : 'bg-green-50'}`}>
                  <p className={`text-xs ${isDarkMode ? 'text-green-400' : 'text-green-600'} mb-1`}>Tablice</p>
                  <p className={`font-mono font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {activeSession.plateNumber}
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-green-800' : 'bg-green-50'}`}>
                  <p className={`text-xs ${isDarkMode ? 'text-green-400' : 'text-green-600'} mb-1`}>Početak</p>
                  <p className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {activeSession.checkInTime.toLocaleTimeString('sr-RU', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-green-800' : 'bg-green-50'}`}>
                  <p className={`text-xs ${isDarkMode ? 'text-green-400' : 'text-green-600'} mb-1`}>Trajanje</p>
                  <p className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {formatDuration(activeSession.checkInTime)}
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-green-800' : 'bg-green-50'}`}>
                  <p className={`text-xs ${isDarkMode ? 'text-green-400' : 'text-green-600'} mb-1`}>Procena Cena</p>
                  <p className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {(() => {
                      const zone = parkingZones.find(z => z.id === activeSession.zoneId);
                      const duration = (new Date().getTime() - activeSession.checkInTime.getTime()) / 1000 / 60 / 60;
                      return zone ? Math.ceil(duration * zone.pricePerHour) : 0;
                    })()} RSD
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Enhanced Check-In Form */
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {t ? t('parking.newSession') : 'Nova Parking Sesija'}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Brzi check-in</span>
                  <div className="w-12 h-6 bg-blue-600 rounded-full relative">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all"></div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Registarske Tablice
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={plateNumber}
                        onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                        placeholder="BG 123-AB"
                        className={`w-full px-4 py-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                      <Car size={20} className={`absolute right-3 top-3.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Parking Zona
                      </label>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handleGetCurrentLocation}
                          className={`text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-all ${
                            isDarkMode ? 'bg-blue-900 text-blue-300 hover:bg-blue-800' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          }`}
                        >
                          <Navigation size={12} />
                          <span>Najbliža</span>
                        </button>
                        <button
                          onClick={() => setShowFilters(!showFilters)}
                          className={`text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-all ${
                            isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <Filter size={12} />
                          <span>Filter</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <Search size={20} className={`absolute left-3 top-3.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Pretraži parking zone..."
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Filters */}
                  {showFilters && (
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} space-y-3`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Filteri</span>
                        <button onClick={() => setShowFilters(false)}>
                          <X size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { value: 'all', label: 'Sve' },
                          { value: 'free', label: 'Besplatno' },
                          { value: 'covered', label: 'Pokriveno' },
                          { value: '24/7', label: '24/7' },
                          { value: 'available', label: 'Dostupno' }
                        ].map(filter => (
                          <button
                            key={filter.value}
                            onClick={() => setSelectedFilter(filter.value)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                              selectedFilter === filter.value
                                ? 'bg-blue-600 text-white'
                                : isDarkMode ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {filter.label}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Sortiraj:</span>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className={`text-sm px-2 py-1 rounded border ${
                            isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        >
                          <option value="distance">Udaljenost</option>
                          <option value="price">Cena</option>
                          <option value="rating">Ocena</option>
                          <option value="availability">Dostupnost</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto pr-2">
                    {filteredAndSortedZones.map((zone) => {
                      const occupancyRate = (zone.occupiedSpaces / zone.totalSpaces) * 100;
                      return (
                        <button
                          key={zone.id}
                          onClick={() => setSelectedZone(zone)}
                          className={`p-4 rounded-xl border text-left transition-all transform hover:scale-102 ${
                            selectedZone?.id === zone.id
                              ? isDarkMode ? 'bg-blue-900 border-blue-600 shadow-lg' : 'bg-blue-50 border-blue-300 shadow-lg'
                              : isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                {zone.name}
                              </h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <div className="flex items-center">
                                  <Star size={12} className="text-yellow-500 fill-current" />
                                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {zone.rating}
                                  </span>
                                </div>
                                {zone.pricePerHour === 0 ? (
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Besplatno</span>
                                ) : (
                                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {zone.pricePerHour} RSD/h
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className={`text-right`}>
                              <span className={`text-sm font-bold ${getOccupancyColor(zone.occupiedSpaces, zone.totalSpaces)}`}>
                                {zone.totalSpaces - zone.occupiedSpaces}/{zone.totalSpaces}
                              </span>
                              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {Math.round(occupancyRate)}% zauzeto
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mb-2">
                            {zone.features.slice(0, 3).map((feature, index) => (
                              <span
                                key={index}
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                                }`}
                              >
                                {feature}
                              </span>
                            ))}
                            {zone.features.length > 3 && (
                              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                +{zone.features.length - 3}
                              </span>
                            )}
                          </div>

                          <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                            <div
                              className={`h-full rounded-full transition-all ${
                                occupancyRate <= 20 ? 'bg-green-500' :
                                occupancyRate <= 80 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${occupancyRate}%` }}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {selectedZone ? (
                    <span>Izabrano: <strong>{selectedZone.name}</strong></span>
                  ) : (
                    <span>Izaberite parking zonu</span>
                  )}
                </div>
                <button
                  onClick={handleCheckIn}
                  disabled={!plateNumber.trim() || !selectedZone}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg transform hover:scale-105"
                >
                  <CheckCircle size={20} />
                  <span className="font-semibold">Započni Parking</span>
                </button>
              </div>
            </div>
          )}

          {/* Enhanced Parking History */}
          {parkingHistory.length > 0 && (
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {t ? t('parking.history') : 'Parking Istorija'}
                </h3>
                <button className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline flex items-center space-x-1`}>
                  <Calendar size={16} />
                  <span>Prikaži sve</span>
                </button>
              </div>
              
              <div className="space-y-3">
                {parkingHistory.slice(0, 5).map((session) => (
                  <div key={session.id} className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} hover:shadow-md transition-all`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                          <Car size={16} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
                        </div>
                        <div>
                          <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            {session.zoneName}
                          </p>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {session.plateNumber} • {formatDuration(session.checkInTime, session.checkOutTime)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                          {session.cost || 0} RSD
                        </p>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {session.checkInTime.toLocaleDateString('sr-RU')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParkingCheckIn;
