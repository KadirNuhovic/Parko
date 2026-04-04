import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SubscriptionContextType {
  currentPlan: 'basic' | 'premium';
  isPremium: boolean;
  isLoading: boolean;
  upgradeToPremium: () => Promise<void>;
  cancelSubscription: () => Promise<void>;
  subscriptionStatus: {
    isActive: boolean;
    expiresAt?: Date;
    autoRenew: boolean;
  };
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const [currentPlan, setCurrentPlan] = useState<'basic' | 'premium'>('basic');
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    isActive: boolean;
    expiresAt?: Date;
    autoRenew: boolean;
  }>({
    isActive: false,
    autoRenew: true,
  });

  const isPremium = currentPlan === 'premium';

  // Load subscription data from localStorage on mount
  useEffect(() => {
    const savedPlan = localStorage.getItem('parkingSubscriptionPlan');
    const savedStatus = localStorage.getItem('parkingSubscriptionStatus');
    const savedExpiry = localStorage.getItem('parkingSubscriptionExpiry');

    if (savedPlan) {
      setCurrentPlan(savedPlan as 'basic' | 'premium');
    }

    if (savedStatus) {
      setSubscriptionStatus(JSON.parse(savedStatus));
    }

    if (savedExpiry) {
      const expiryDate = new Date(savedExpiry);
      if (expiryDate > new Date()) {
        setSubscriptionStatus(prev => ({ ...prev, expiresAt: expiryDate, isActive: true }));
      } else {
        // Subscription expired, downgrade to basic
        setCurrentPlan('basic');
        setSubscriptionStatus(prev => ({ ...prev, isActive: false, expiresAt: undefined }));
        localStorage.removeItem('parkingSubscriptionPlan');
        localStorage.removeItem('parkingSubscriptionStatus');
        localStorage.removeItem('parkingSubscriptionExpiry');
      }
    }
  }, []);

  const upgradeToPremium = async () => {
    setIsLoading(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would make an API call to process payment
      const response = await simulatePaymentProcess();
      
      if (response.success) {
        setCurrentPlan('premium');
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 month from now
        
        setSubscriptionStatus({
          isActive: true,
          expiresAt,
          autoRenew: true,
        });

        // Save to localStorage
        localStorage.setItem('parkingSubscriptionPlan', 'premium');
        localStorage.setItem('parkingSubscriptionStatus', JSON.stringify({
          isActive: true,
          autoRenew: true,
        }));
        localStorage.setItem('parkingSubscriptionExpiry', expiresAt.toISOString());

        // Show success notification
        showNotification('Uspešno ste upgrade-ovali na Premium plan!', 'success');
      } else {
        throw new Error(response.message || 'Payment failed');
      }
    } catch (error) {
      console.error('Upgrade failed:', error);
      showNotification('Greška prilikom upgrade-a. Molimo pokušajte ponovo.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSubscription = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would make an API call to cancel subscription
      setCurrentPlan('basic');
      setSubscriptionStatus(prev => ({
        ...prev,
        isActive: false,
        expiresAt: undefined,
      }));

      // Remove from localStorage
      localStorage.removeItem('parkingSubscriptionPlan');
      localStorage.removeItem('parkingSubscriptionStatus');
      localStorage.removeItem('parkingSubscriptionExpiry');

      showNotification('Pretplata je otkazana. Žao nam je što odlazite!', 'info');
    } catch (error) {
      console.error('Cancellation failed:', error);
      showNotification('Greška prilikom otkazivanja. Molimo kontaktirajte podršku.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate payment process
  const simulatePaymentProcess = async (): Promise<{ success: boolean; message?: string }> => {
    // Simulate random success/failure for demo
    const isSuccess = Math.random() > 0.1; // 90% success rate
    
    if (isSuccess) {
      return { success: true };
    } else {
      return { success: false, message: 'Payment processing failed' };
    }
  };

  // Notification helper
  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    // This would integrate with your existing notification system
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // You could emit an event or use a toast library here
    if (type === 'success') {
      // Green notification
      alert(`✅ ${message}`);
    } else if (type === 'error') {
      // Red notification
      alert(`❌ ${message}`);
    } else {
      // Blue notification
      alert(`ℹ️ ${message}`);
    }
  };

  const value: SubscriptionContextType = {
    currentPlan,
    isPremium,
    isLoading,
    upgradeToPremium,
    cancelSubscription,
    subscriptionStatus,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

// Premium features checker
export const canUseFeature = (feature: string, isPremium: boolean): boolean => {
  const premiumFeatures = [
    'real-time-notifications',
    'parking-reservation',
    'fuel-consumption',
    'air-quality',
    'priority-display',
    'advanced-statistics',
    'weekend-free-reservation',
  ];

  const basicFeatures = [
    'parking-display',
    'standard-notifications',
    'basic-zone-info',
    'parking-history',
  ];

  if (basicFeatures.includes(feature)) {
    return true; // Available for all users
  }

  if (premiumFeatures.includes(feature)) {
    return isPremium; // Only for premium users
  }

  return false; // Unknown feature
};

export default SubscriptionContext;
