import React, { useState } from 'react';
import { Check, X, Crown, Star, Zap, Shield, Clock, MapPin, DollarSign, Leaf, Car } from 'lucide-react';
import { useSubscription } from './SubscriptionContext.tsx';
import { useTheme } from './ThemeContext.tsx';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  included: boolean[];
  popular?: boolean;
  icon: React.ReactNode;
}

const SubscriptionPlans: React.FC = () => {
  const { currentPlan, isPremium, isLoading, upgradeToPremium, cancelSubscription, subscriptionStatus } = useSubscription();
  const { isDarkMode } = useTheme();
  const [selectedPlan, setSelectedPlan] = useState<string>(currentPlan);

  const plans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: '0',
      period: 'Besplatno',
      icon: <Shield className="w-6 h-6" />,
      features: [
        'Prikaz slobodnih parking mesta',
        'Standardne notifikacije',
        'Osnovne informacije o zonama',
        'Istorija parkiranja'
      ],
      included: [true, true, true, true]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '2',
      period: '€ mesečno',
      icon: <Crown className="w-6 h-6" />,
      popular: true,
      features: [
        'Prikaz slobodnih parking mesta',
        'Real-time notifikacije',
        'Mogućnost rezervacije parking mesta',
        'Potrošnja goriva',
        'Zagađenje vazduha',
        'Prioritet pri prikazu mesta',
        'Napredne statistike',
        'Besplatna rezervacija vikendom'
      ],
      included: [true, true, true, true, true, true, true, true]
    }
  ];

  const handleUpgrade = async (planId: string) => {
    if (planId === currentPlan) return;
    
    setSelectedPlan(planId);
    
    if (planId === 'premium') {
      await upgradeToPremium();
    }
  };

  return (
    <div className={`min-h-screen p-4 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <Crown className="w-8 h-8 text-yellow-500 mr-2" />
            <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Premium Parking</h1>
          </div>
          <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Odaberite plan koji odgovara vašim potrebama</p>
          
          {/* Current Status */}
          {subscriptionStatus.isActive && (
            <div className={`mt-6 inline-flex items-center px-4 py-2 rounded-full ${isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'}`}>
              <div className={`w-2 h-2 rounded-full mr-2 animate-pulse ${isDarkMode ? 'bg-green-400' : 'bg-green-500'}`}></div>
              <span className="font-medium">
                Premium aktivno • Ističe: {subscriptionStatus.expiresAt?.toLocaleDateString('sr-RU')}
              </span>
            </div>
          )}
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 ${
                plan.popular ? 'ring-4 ring-blue-500' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-bl-xl">
                  <span className="text-sm font-semibold flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Popularno
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-full ${plan.popular ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                      {plan.icon}
                    </div>
                    <div>
                      <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                      <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>{plan.period}</p>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline">
                    <span className={`text-5xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>€{plan.price}</span>
                    {plan.period !== 'Besplatno' && (
                      <span className={`ml-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>/mesec</span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        {plan.included[index] ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : (
                          <X className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <span className={`ml-3 ${plan.included[index] ? (isDarkMode ? 'text-gray-200' : 'text-gray-700') : 'text-gray-400'}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={isLoading || plan.id === currentPlan}
                  className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    plan.id === currentPlan
                      ? isDarkMode ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : plan.popular
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 shadow-lg'
                      : isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {isLoading && selectedPlan === plan.id ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Obrada...
                    </div>
                  ) : plan.id === currentPlan ? (
                    'Trenutni plan'
                  ) : plan.popular ? (
                    <div className="flex items-center justify-center">
                      <Zap className="w-5 h-5 mr-2" />
                      Upgrade na Premium
                    </div>
                  ) : (
                    'Odaberi Basic'
                  )}
                </button>
                
                {/* Cancel Subscription Button for Premium users */}
                {plan.id === 'premium' && currentPlan === 'premium' && (
                  <button
                    onClick={cancelSubscription}
                    disabled={isLoading}
                    className={`w-full mt-3 py-2 px-4 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-sm font-medium ${isDarkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50'}`}
                  >
                    {isLoading ? 'Obrada...' : 'Otkaži pretplatu'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Feature Comparison */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8`}>
          <h2 className={`text-2xl font-bold mb-8 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Poredjenje funkcionalnosti</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className={`text-left py-4 px-4 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Funkcionalnost</th>
                  <th className={`text-center py-4 px-4 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Basic</th>
                  <th className={`text-center py-4 px-4 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Premium</th>
                </tr>
              </thead>
              <tbody>
                <tr className={`border-b ${isDarkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-100 hover:bg-gray-50'}`}>
                  <td className="py-4 px-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                    Prikaz slobodnih mesta
                  </td>
                  <td className="text-center py-4 px-4">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className={`border-b ${isDarkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-100 hover:bg-gray-50'}`}>
                  <td className="py-4 px-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-500" />
                    Brzina notifikacija
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Standardne</span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className={`font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Real-time</span>
                  </td>
                </tr>
                <tr className={`border-b ${isDarkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-100 hover:bg-gray-50'}`}>
                  <td className="py-4 px-4 flex items-center">
                    <Car className="w-5 h-5 mr-2 text-blue-500" />
                    Rezervacija mesta
                  </td>
                  <td className="text-center py-4 px-4">
                    <X className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className={`border-b ${isDarkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-100 hover:bg-gray-50'}`}>
                  <td className="py-4 px-4 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-blue-500" />
                    Potrošnja goriva
                  </td>
                  <td className="text-center py-4 px-4">
                    <X className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className={`border-b ${isDarkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-100 hover:bg-gray-50'}`}>
                  <td className="py-4 px-4 flex items-center">
                    <Leaf className="w-5 h-5 mr-2 text-blue-500" />
                    Zagađenje vazduha
                  </td>
                  <td className="text-center py-4 px-4">
                    <X className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className={`hover:bg-gray-50 ${isDarkMode ? 'hover:bg-gray-700/50' : ''}`}>
                  <td className="py-4 px-4 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-blue-500" />
                    Prioritet prikaza
                  </td>
                  <td className="text-center py-4 px-4">
                    <X className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className={`mt-12 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8`}>
          <h2 className={`text-2xl font-bold mb-8 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Često postavljana pitanja</h2>
          
          <div className="space-y-6">
            <div className={`border-b pb-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Kako mogu da upgrade-ujem na Premium?</h3>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Kliknite na "Upgrade na Premium" dugme i sledite uputstva za plaćanje. Plaćanje je bezbedno i obavlja se mesečno.</p>
            </div>
            
            <div className={`border-b pb-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Da li mogu da otkažem Premium bilo kada?</h3>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Da, možete otkaži Premium pretplatu bilo kada. Bićete naplaćeni samo za tekući mesec.</p>
            </div>
            
            <div className={`border-b pb-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Šta su real-time notifikacije?</h3>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Real-time notifikacije vam obezbeđuju trenutne informacije o slobodnim parking mestima, dok se oslobadaju.</p>
            </div>
            
            <div>
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Kako funkcioniše rezervacija parking mesta?</h3>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Premium korisnici mogu da rezervišu parking mesto do 30 minuta pre dolaska. Mesto ostaje rezervisano za vas.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
