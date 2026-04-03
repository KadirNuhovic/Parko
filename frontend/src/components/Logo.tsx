import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'medium', showText = true, className = '' }) => {
  const sizeConfig = {
    small: { imageSize: 40, textSize: 'text-sm', containerSize: 'w-10 h-10' },
    medium: { imageSize: 48, textSize: 'text-base', containerSize: 'w-12 h-12' },
    large: { imageSize: 56, textSize: 'text-lg', containerSize: 'w-14 h-14' }
  };

  const config = sizeConfig[size];

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`${config.containerSize} rounded-xl flex items-center justify-center shadow-lg overflow-hidden`}>
        <img 
          src="/images/Parko.png" 
          alt="Parko Logo" 
          className="w-full h-full object-cover"
        />
      </div>
      {showText && (
        <div>
          <h1 className={`font-bold text-gray-900 ${config.textSize}`}>Parko</h1>
          <p className="text-xs text-gray-500 hidden sm:block">Gradski informacioni sistem</p>
        </div>
      )}
    </div>
  );
};
