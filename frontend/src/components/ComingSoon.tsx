import React from 'react';
import { Globe, Clock, ArrowRight, Star, Zap, Package, Users, TrendingUp } from 'lucide-react';

export const ComingSoon: React.FC = () => {
  const features = [
    {
      icon: Globe,
      title: 'Globalna Mreža',
      description: 'Povezivanje sa gradovima širom sveta za deljenje najboljih praksi.',
      status: 'U razvoju'
    },
    {
      icon: Users,
      title: 'Korisnički Profili',
      description: 'Napredni profili sa personalizovanim podešavanjima i preferencama.',
      status: 'U planiranju'
    },
    {
      icon: Package,
      title: 'Paket Rešenja',
      description: 'Kompletan paket za gradske službe i građane.',
      status: 'U razvoju'
    },
    {
      icon: TrendingUp,
      title: 'Analitika',
      description: 'Detaljne analitike i izveštaji o stanju u gradu.',
      status: 'U planiranju'
    },
    {
      icon: Zap,
      title: 'AI Asistent',
      description: 'Veštačka inteligencija za brže rešavanje problema.',
      status: 'Istraživanje'
    },
    {
      icon: Star,
      title: 'Nagradni Sistem',
      description: 'Bodovi i nagrade za aktivne građane.',
      status: 'Koncept'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'U razvoju':
        return 'text-green-600 bg-green-100';
      case 'U planiranju':
        return 'text-blue-600 bg-blue-100';
      case 'Istraživanje':
        return 'text-purple-600 bg-purple-100';
      case 'Koncept':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6">
            <Globe className="text-white" size={40} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Uskoro Dostupno
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Radimo na novim funkcijama koje će učiniti Smart Mitrovica još boljom platformom za sve građane.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                    <Icon className="text-white" size={24} />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(feature.status)}`}>
                    {feature.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Razvojni Plan
          </h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Clock className="text-green-600" size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Q1 2024 - Globalna Mreža
                  </h3>
                  <span className="text-sm text-green-600 font-medium">Aktivno</span>
                </div>
                <p className="text-gray-600">
                  Povezivanje sa gradovima širom sveta za deljenje najboljih praksi i rešenja.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="text-blue-600" size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Q2 2024 - Korisnički Profili
                  </h3>
                  <span className="text-sm text-blue-600 font-medium">U planiranju</span>
                </div>
                <p className="text-gray-600">
                  Personalizovani profili sa naprednim podešavanjima i praćenjem aktivnosti.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Zap className="text-purple-600" size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Q3 2024 - AI Asistent
                  </h3>
                  <span className="text-sm text-purple-600 font-medium">Istraživanje</span>
                </div>
                <p className="text-gray-600">
                  Veštačka inteligencija za brže rešavanje problema i preporuke.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">
            Budite Među Prvim
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Prijavite se za beta testiranje novih funkcija i dobijte ekskluzivan pristup.
          </p>
          <button className="inline-flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            <span>Prijavite se za Beta</span>
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500">
            Imate pitanja ili predloge? Kontaktirajte nas na{' '}
            <a href="mailto:info@smartmitrovica.rs" className="text-blue-600 hover:text-blue-700 font-medium">
              info@smartmitrovica.rs
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
