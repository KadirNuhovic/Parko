import React, { useEffect, useState } from 'react';
import { Logo } from './Logo.tsx';
import { useTheme } from './ThemeContext.tsx';

interface LoadingScreenProps {
  onComplete?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const { isDarkMode } = useTheme();
  const [isVisible, setIsVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Pokreni fade out nakon 2.5 sekunde
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2500);

    // Kompletno sakrij nakon 3 sekunde
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-500 ${
      fadeOut ? 'opacity-0' : 'opacity-100'
    } ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-20 left-20 w-32 h-32 rounded-full opacity-20 animate-pulse ${
          isDarkMode ? 'bg-blue-500' : 'bg-blue-400'
        }`}></div>
        <div className={`absolute bottom-20 right-20 w-24 h-24 rounded-full opacity-20 animate-pulse delay-75 ${
          isDarkMode ? 'bg-purple-500' : 'bg-purple-400'
        }`}></div>
        <div className={`absolute top-1/2 left-1/3 w-16 h-16 rounded-full opacity-20 animate-pulse delay-150 ${
          isDarkMode ? 'bg-indigo-500' : 'bg-indigo-400'
        }`}></div>
      </div>

      {/* Logo Container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo Animation */}
        <div className={`mb-8 transform transition-all duration-1000 ${
          fadeOut ? 'scale-90' : 'scale-100'
        }`}>
          <div className="relative">
            {/* Glow Effect */}
            <div className={`absolute inset-0 rounded-full blur-2xl opacity-50 animate-pulse ${
              isDarkMode ? 'bg-blue-500' : 'bg-blue-400'
            }`}></div>
            
            {/* Logo */}
            <div className={`relative p-8 rounded-2xl shadow-2xl transition-all duration-300 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <Logo size="extra-large" showText={false} />
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className={`text-center mb-8 transition-all duration-1000 delay-300 ${
          fadeOut ? 'opacity-0 transform -translate-y-4' : 'opacity-100 transform translate-y-0'
        }`}>
          <h1 className={`text-4xl font-bold mb-3 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Gradski Informacioni Centar
          </h1>
          <p className={`text-xl ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Dobrodošli
          </p>
        </div>

        {/* Loading Dots */}
        <div className={`flex space-x-2 transition-all duration-1000 delay-500 ${
          fadeOut ? 'opacity-0' : 'opacity-100'
        }`}>
          <div className={`w-3 h-3 rounded-full animate-bounce ${
            isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
          }`}></div>
          <div className={`w-3 h-3 rounded-full animate-bounce delay-75 ${
            isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
          }`}></div>
          <div className={`w-3 h-3 rounded-full animate-bounce delay-150 ${
            isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
          }`}></div>
        </div>

        {/* Progress Bar */}
        <div className={`absolute bottom-20 left-1/2 transform -translate-x-1/2 w-64 transition-all duration-1000 delay-700 ${
          fadeOut ? 'opacity-0' : 'opacity-100'
        }`}>
          <div className={`h-1 rounded-full overflow-hidden ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <div className={`h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse`}></div>
          </div>
        </div>
      </div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full" style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                           linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
