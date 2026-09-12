import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { BottomNav } from '../common/BottomNav';
import { CustomerHomePage } from '../../pages/customer/CustomerHomePage';
import { ServiceDetailPage } from '../../pages/customer/ServiceDetailPage';
import { WorkerMatchingPage } from '../../pages/customer/WorkerMatchingPage';
import { BookingTrackingPage } from '../../pages/customer/BookingTrackingPage';
import { CustomerHistoryPage } from '../../pages/customer/CustomerHistoryPage';
import { CustomerProfilePage } from '../../pages/customer/CustomerProfilePage';
import { CustomerMoneyPage } from '../../pages/customer/CustomerMoneyPage';
import { SplashScreen } from '../../pages/customer/SplashScreen';
import { CustomerLoginScreen } from '../../pages/customer/onboarding/CustomerLoginScreen';
import { CustomerOtpScreen } from '../../pages/customer/onboarding/CustomerOtpScreen';
import { PersonalDetailsScreen } from '../../pages/customer/onboarding/PersonalDetailsScreen';
import { LocationScreen } from '../../pages/customer/onboarding/LocationScreen';
import { AddAddressScreen } from '../../pages/customer/onboarding/AddAddressScreen';
import { AddressSelectorModal } from '../customer/AddressSelectorModal';

export const CustomerShell: React.FC = () => {
  const { activeView, selectedLocation, setSelectedLocation } = useBooking();

  // Onboarding Step State (null = regular home marketplace)
  const [onboardingStep, setOnboardingStep] = useState<
    'splash' | 'login' | 'otp' | 'personal' | 'location' | 'address' | null
  >(null);

  const [tempPhone, setTempPhone] = useState<string>('');
  const [tempLocation, setTempLocation] = useState<string>(selectedLocation || 'Indiranagar, Bangalore');
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);

  // 1. Splash Screen Flow
  if (onboardingStep === 'splash') {
    return (
      <SplashScreen
        onDismiss={() => setOnboardingStep('login')}
      />
    );
  }

  // 2. Onboarding: Customer Login Screen
  if (onboardingStep === 'login') {
    return (
      <div style={{ width: '100%', maxWidth: '440px', margin: '0 auto' }}>
        <CustomerLoginScreen
          onContinue={(phone) => {
            setTempPhone(phone);
            setOnboardingStep('otp');
          }}
          onSkip={() => setOnboardingStep(null)}
        />
      </div>
    );
  }

  // 3. Onboarding: OTP Verification Screen
  if (onboardingStep === 'otp') {
    return (
      <div style={{ width: '100%', maxWidth: '440px', margin: '0 auto' }}>
        <CustomerOtpScreen
          phone={tempPhone}
          onVerified={() => setOnboardingStep('personal')}
          onBack={() => setOnboardingStep('login')}
        />
      </div>
    );
  }

  // 4. Onboarding: Personal Details Screen
  if (onboardingStep === 'personal') {
    return (
      <div style={{ width: '100%', maxWidth: '440px', margin: '0 auto' }}>
        <PersonalDetailsScreen
          onConfirm={(_details) => {
            setOnboardingStep('location');
          }}
          onBack={() => setOnboardingStep('otp')}
        />
      </div>
    );
  }

  // 5. Onboarding: Location Screen
  if (onboardingStep === 'location') {
    return (
      <div style={{ width: '100%', maxWidth: '440px', margin: '0 auto' }}>
        <LocationScreen
          onLocationSelected={(loc) => {
            setTempLocation(loc);
            setSelectedLocation(loc);
            setOnboardingStep('address');
          }}
          onBack={() => setOnboardingStep('personal')}
        />
      </div>
    );
  }

  // 6. Onboarding: Add Address Details Screen
  if (onboardingStep === 'address') {
    return (
      <div style={{ width: '100%', maxWidth: '440px', margin: '0 auto' }}>
        <AddAddressScreen
          initialLocation={tempLocation}
          onChangeLocation={() => setOnboardingStep('location')}
          onSaveAddress={(addr) => {
            setSelectedLocation(addr.locality);
            setOnboardingStep(null);
          }}
          onBack={() => setOnboardingStep('location')}
        />
      </div>
    );
  }

  // Regular Customer Experience
  const renderActiveView = () => {
    switch (activeView) {
      case 'service-detail':
        return <ServiceDetailPage />;
      case 'worker-matching':
        return <WorkerMatchingPage />;
      case 'tracking':
        return <BookingTrackingPage />;
      case 'history':
        return <CustomerHistoryPage />;
      case 'profile':
        return <CustomerProfilePage onOpenAddresses={() => setShowAddressModal(true)} />;
      case 'money':
        return <CustomerMoneyPage />;
      case 'home':
      default:
        return (
          <CustomerHomePage
            onOpenOnboarding={() => setOnboardingStep('address')}
          />
        );
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'var(--pronto-cream, #FCFBF4)',
        width: '100%',
        maxWidth: '440px',
        margin: '0 auto',
        position: 'relative',
        boxShadow: '0 0 40px rgba(0, 0, 0, 0.08)',
      }}
      className="animate-fade-in"
    >
      <main style={{ flex: 1, position: 'relative' }}>
        <div key={activeView} className="animate-fade-in" style={{ width: '100%' }}>
          {renderActiveView()}
        </div>
      </main>

      {/* Floating Bottom Navigation Bar */}
      <BottomNav />

      {/* Global Address Selector Modal */}
      <AddressSelectorModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        selectedAddress={selectedLocation}
        onSelectAddress={(loc) => setSelectedLocation(loc)}
        onAddNewAddress={() => {
          setShowAddressModal(false);
          setOnboardingStep('address');
        }}
      />
    </div>
  );
};
