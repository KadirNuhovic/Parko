import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Plus, Navigation, Layers, MapPin, Car } from 'lucide-react';

const customIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface Location {
  id: number;
  lat: number;
  lng: number;
  title: string;
  description: string;
  type: string;
  status: string;
  priority: string;
  date: string;
}

interface ParkingZone {
  id: number;
  lat: number;
  lng: number;
  name: string;
  totalSpaces: number;
  occupiedSpaces: number;
  radius: number;
}

const MapEvents: React.FC<{ onLocationClick: (lat: number, lng: number) => void }> = ({ onLocationClick }) => {
  useMapEvents({
    click: (e) => {
      onLocationClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

export const MapView: React.FC<{ t?: (key: string) => string }> = ({ t }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Load theme from localStorage or default to false
    const savedTheme = localStorage.getItem('smartMitrovicaTheme');
    return savedTheme === 'dark';
  });

  const [parkingZones, setParkingZones] = useState<ParkingZone[]>([
    // Parking zone - Severna Kosovska Mitrovica
    { id: 1, name: 'Parking Centar', totalSpaces: 50, occupiedSpaces: 25, radius: 150, lat: 42.8893, lng: 20.8731 },
    { id: 2, name: 'Parking Tehnički Fakultet', totalSpaces: 30, occupiedSpaces: 15, radius: 120, lat: 42.9000, lng: 20.8600 },
    { id: 3, name: 'Parking Bolnica', totalSpaces: 40, occupiedSpaces: 35, radius: 130, lat: 42.8980, lng: 20.8680 },
    { id: 4, name: 'Parking Knez', totalSpaces: 25, occupiedSpaces: 5, radius: 100, lat: 42.9050, lng: 20.8620 },
    { id: 5, name: 'Parking Krugni Tok Sever', totalSpaces: 60, occupiedSpaces: 48, radius: 180, lat: 42.9080, lng: 20.8700 },
    { id: 6, name: 'Parking Tržni Centar', totalSpaces: 80, occupiedSpaces: 20, radius: 200, lat: 42.8920, lng: 20.8750 },
    { id: 7, name: 'Parking Stadion', totalSpaces: 100, occupiedSpaces: 70, radius: 220, lat: 42.8960, lng: 20.8780 },
    { id: 8, name: 'Parking Železnička Stanica', totalSpaces: 35, occupiedSpaces: 28, radius: 110, lat: 42.8850, lng: 20.8800 },
    { id: 9, name: 'Parking Škola', totalSpaces: 20, occupiedSpaces: 8, radius: 90, lat: 42.9020, lng: 20.8650 },
    { id: 10, name: 'Parking Opština', totalSpaces: 45, occupiedSpaces: 40, radius: 140, lat: 42.8870, lng: 20.8710 }
  ]);

  const [locations] = useState<Location[]>([
    // Radovi na putu - Severna Kosovska Mitrovica
    { id: 6, title: 'Radovi - Put ka Tehničkom Fakultetu', description: 'Širenje puta, radovi u toku', type: 'radovi', status: 'u_procesu', priority: 'srednji', lat: 42.9010, lng: 20.8610, date: '15.03.2024.' },
    { id: 7, title: 'Radovi - Ulica kod Bolnice', description: 'Popravka asfalta, očekivano završetak 25.03.2024.', type: 'radovi', status: 'u_procesu', priority: 'visok', lat: 42.8990, lng: 20.8670, date: '14.03.2024.' },
    { id: 8, title: 'Radovi - Raskršće kod Kneza', description: 'Postavljanje novog semafora', type: 'radovi', status: 'u_procesu', priority: 'srednji', lat: 42.9060, lng: 20.8630, date: '13.03.2024.' },
    { id: 9, title: 'Radovi - Krugni Tok Sever', description: 'Rekonstrukcija krugnog toka', type: 'radovi', status: 'u_procesu', priority: 'visok', lat: 42.9070, lng: 20.8690, date: '12.03.2024.' },
    { id: 10, title: 'Radovi - Severni Bulevar', description: 'Izgradnja biciklističke staze', type: 'radovi', status: 'u_procesu', priority: 'nizak', lat: 42.9030, lng: 20.8640, date: '11.03.2024.' }
  ]);

  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

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

  // AI sistem za automatsku promenu zauzetosti parking zona
  useEffect(() => {
    const interval = setInterval(() => {
      setParkingZones(prevZones => 
        prevZones.map(zone => {
          // Simulacija AI promene zauzetosti
          const change = Math.random() * 10 - 5; // -5 do +5 mesta
          const newOccupied = Math.max(0, Math.min(zone.totalSpaces, zone.occupiedSpaces + Math.round(change)));
          return { ...zone, occupiedSpaces: newOccupied };
        })
      );
    }, 7000); // Svakih 7 sekundi

    return () => clearInterval(interval);
  }, []);

  const getOccupancyColor = (occupied: number, total: number) => {
    const percentage = (occupied / total) * 100;
    if (percentage <= 20) {
      return isDarkMode ? '#10b981' : '#22c55e'; // zelena
    } else if (percentage <= 80) {
      return isDarkMode ? '#f59e0b' : '#eab308'; // zuta
    } else {
      return isDarkMode ? '#dc2626' : '#ef4444'; // crvena
    }
  };

  const getOccupancyStatus = (occupied: number, total: number) => {
    const percentage = (occupied / total) * 100;
    if (percentage <= 20) return 'Slobodno';
    if (percentage <= 80) return 'Delimično Zauzeto';
    return 'Zauzeto';
  };

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setShowAddForm(true);
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSelectedLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      'parking': '🅿️',
      'radovi': '🚧',
      'slobodno': '✅',
      'u_procesu': '⚠️',
      'zauzeto': '❌'
    };
    return icons[type as keyof typeof icons] || '📍';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'slobodno': 'text-green-500',
      'u_procesu': 'text-yellow-500',
      'zauzeto': 'text-red-500',
      'zavrseno': 'text-gray-500'
    };
    return colors[status as keyof typeof colors] || 'text-gray-500';
  };

  return (
    <div className={`h-full w-full flex flex-col ${isDarkMode ? 'dark' : ''}`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b p-4 lg:p-6 flex-shrink-0 mt-4`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Mobile Title */}
          <div className="lg:hidden flex items-center justify-center w-full">
            <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{t ? t('menu.map') : 'Mapa'}</h2>
          </div>
          
          {/* Desktop Title */}
          <div className="hidden lg:block">
            <h2 className={`text-xl lg:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{t ? t('menu.map') : 'Mapa'}</h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>{t ? t('common.reportProblems') : 'Prijavite i pratite probleme u vašem gradu'}</p>
          </div>
          
          {/* Desktop Buttons */}
          <div className="hidden lg:flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto">
            <button
              onClick={handleGetCurrentLocation}
              className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
            >
              <Navigation size={18} />
              <span>{t ? t('common.myLocation') : 'Moja Lokacija'}</span>
            </button>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center justify-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors w-full sm:w-auto"
            >
              <Plus size={18} />
              <span>{t ? t('common.addReport') : 'Dodaj'}</span> <span>{t ? t('common.report') : 'Prijavu'}</span>
            </button>
          </div>
        </div>
        
        {/* Mobile Buttons */}
        <div className="lg:hidden flex flex-col sm:flex-row gap-2 sm:gap-3 w-full mt-4">
          <button
            onClick={handleGetCurrentLocation}
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            <Navigation size={18} />
            <span>Moja Lokacija</span>
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center justify-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors w-full sm:w-auto"
          >
            <Plus size={18} />
            <span>Dodaj Prijavu</span>
          </button>
        </div>
      </div>

      {/* Map Container - Glavni deo */}
      <div className="flex-1 relative overflow-hidden mx-4 mb-4" style={{ minHeight: '400px' }}>
        <div className={`absolute inset-0 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-none lg:rounded-lg overflow-hidden`}>
          <MapContainer
            center={[42.8893, 20.8731]}
            zoom={13}
            style={{ 
              height: '100%', 
              width: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1
            }}
            className="z-10"
            key="map-container"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              key="tile-layer"
            />
            <MapEvents onLocationClick={handleMapClick} key="map-events" />
            
            {/* Parking Zone Circles */}
            {parkingZones.map((zone) => (
              <Circle
                key={zone.id}
                center={[zone.lat, zone.lng]}
                radius={zone.radius}
                pathOptions={{
                  color: getOccupancyColor(zone.occupiedSpaces, zone.totalSpaces),
                  fillColor: getOccupancyColor(zone.occupiedSpaces, zone.totalSpaces),
                  fillOpacity: 0.4,
                  weight: 2,
                }}
              >
                <Popup>
                  <div className={`p-3 min-w-48 max-w-64 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <Car size={18} className="text-blue-500" />
                      <h3 className="font-semibold text-sm">{zone.name}</h3>
                    </div>
                    <div className="space-y-1">
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <span className="font-medium">Zauzeto:</span> {zone.occupiedSpaces}/{zone.totalSpaces} mesta
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <span className="font-medium">Slobodno:</span> {zone.totalSpaces - zone.occupiedSpaces} mesta
                      </p>
                      <p className={`text-sm font-medium ${
                        getOccupancyColor(zone.occupiedSpaces, zone.totalSpaces) === '#22c55e' || getOccupancyColor(zone.occupiedSpaces, zone.totalSpaces) === '#10b981'
                          ? 'text-green-500'
                          : getOccupancyColor(zone.occupiedSpaces, zone.totalSpaces) === '#eab308' || getOccupancyColor(zone.occupiedSpaces, zone.totalSpaces) === '#f59e0b'
                          ? 'text-yellow-500'
                          : 'text-red-500'
                      }`}>
                        Status: {getOccupancyStatus(zone.occupiedSpaces, zone.totalSpaces)}
                      </p>
                    </div>
                  </div>
                </Popup>
              </Circle>
            ))}
            
            {locations.map((location: Location) => (
              <Marker key={location.id} position={[location.lat, location.lng]} icon={customIcon}>
                <Popup>
                  <div className={`p-3 min-w-48 max-w-64 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">{getTypeIcon(location.type)}</span>
                      <h3 className="font-semibold text-sm">{location.title}</h3>
                    </div>
                    <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{location.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-medium ${getStatusColor(location.status)}`}>
                        {location.status === 'slobodno' ? 'Slobodno' :
                         location.status === 'u_procesu' ? 'U Procesu' :
                         location.status === 'zauzeto' ? 'Zauzeto' : 'Završeno'}
                      </span>
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>{location.date}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Map Controls */}
        <div className="hidden lg:flex absolute top-4 right-4 space-y-3 z-20">
          <button
            onClick={handleGetCurrentLocation}
            className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white'} p-3 rounded-lg shadow-lg hover:shadow-xl transition-all`}
          >
            <Navigation size={20} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
          </button>
          <button className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white'} p-3 rounded-lg shadow-lg hover:shadow-xl transition-all`}>
            <Layers size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
          </button>
        </div>

        {/* Mobile Map Controls - Poboljšani */}
        <div className="lg:hidden absolute bottom-4 right-4 space-y-2 z-20">
          <button
            onClick={handleGetCurrentLocation}
            className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white'} p-3 rounded-lg shadow-lg hover:shadow-xl transition-all border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}
          >
            <Navigation size={18} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
          </button>
          <button className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white'} p-3 rounded-lg shadow-lg hover:shadow-xl transition-all border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
            <Plus size={18} className={isDarkMode ? 'text-green-400' : 'text-green-600'} />
          </button>
        </div>

        {/* Mobile Map Info */}
        <div className="lg:hidden absolute top-4 left-4 z-20">
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-3 rounded-lg shadow-lg`}>
            <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Prikažite problem</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Dodirnite mapu</p>
          </div>
        </div>
      </div>

      {/* Stats Cards - Footer */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t p-4 lg:p-6 flex-shrink-0 mx-4 mb-4`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className={`${isDarkMode ? 'bg-green-900 border-green-700' : 'bg-green-50 border-green-200'} p-4 rounded-lg border`}>
            <h3 className={`font-semibold ${isDarkMode ? 'text-green-300' : 'text-green-800'} text-sm md:text-base`}>Slobodne Parking Zone</h3>
            <p className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
              {parkingZones.filter(zone => (zone.occupiedSpaces / zone.totalSpaces) <= 0.2).length}
            </p>
            <p className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>slobodnih zona</p>
          </div>
          <div className={`${isDarkMode ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200'} p-4 rounded-lg border`}>
            <h3 className={`font-semibold ${isDarkMode ? 'text-red-300' : 'text-red-800'} text-sm md:text-base`}>Zauzete Parking Zone</h3>
            <p className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
              {parkingZones.filter(zone => (zone.occupiedSpaces / zone.totalSpaces) > 0.8).length}
            </p>
            <p className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>zauzetih zona</p>
          </div>
          <div className={`${isDarkMode ? 'bg-yellow-900 border-yellow-700' : 'bg-yellow-50 border-yellow-200'} p-4 rounded-lg border`}>
            <h3 className={`font-semibold ${isDarkMode ? 'text-yellow-300' : 'text-yellow-800'} text-sm md:text-base`}>Delimično Zauzete</h3>
            <p className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
              {parkingZones.filter(zone => (zone.occupiedSpaces / zone.totalSpaces) > 0.2 && (zone.occupiedSpaces / zone.totalSpaces) <= 0.8).length}
            </p>
            <p className={`text-sm ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>delimično zauzetih</p>
          </div>
        </div>
        
        {/* Additional Info */}
        <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? 'bg-blue-900' : 'bg-blue-50'}`}>
          <p className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
            <Car size={16} className="inline mr-2" />
            Ukupno parking zona: {parkingZones.length} | 
            Ukupno mesta: {parkingZones.reduce((sum, zone) => sum + zone.totalSpaces, 0)} | 
            Slobodno: {parkingZones.reduce((sum, zone) => sum + (zone.totalSpaces - zone.occupiedSpaces), 0)}
          </p>
        </div>
      </div>

      {/* Add Report Modal */}
      {showAddForm && selectedLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-t-3xl w-full max-h-[90vh] overflow-y-auto`}>
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Nova Prijava</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className={`p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg`}
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className={`flex items-center space-x-3 p-3 ${isDarkMode ? 'bg-blue-900' : 'bg-blue-50'} rounded-xl`}>
                  <MapPin size={20} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>Lokacija izabrana</p>
                    <p className={`text-xs ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Naslov</label>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Unesite naslov prijave"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Tip</label>
                    <select className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}>
                      <option value="saobraćaj">Saobraćaj</option>
                      <option value="infrastruktura">Infrastruktura</option>
                      <option value="parking">Parking</option>
                      <option value="usluge">Usluge</option>
                      <option value="drugo">Drugo</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Prioritet</label>
                    <select className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}>
                      <option value="nizak">Nizak</option>
                      <option value="srednji">Srednji</option>
                      <option value="visok">Visok</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Opis</label>
                    <textarea
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Otkaži
                  </button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
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
