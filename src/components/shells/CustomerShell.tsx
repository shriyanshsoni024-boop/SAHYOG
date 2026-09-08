import React from 'react';
import { useBooking } from '../../context/BookingContext';
import { Header } from '../common/Header';
import { BottomNav } from '../common/BottomNav';
import { MarketplaceFooter } from '../common/MarketplaceFooter';
import { CustomerHomePage } from '../../pages/customer/CustomerHomePage';
import { ServiceDetailPage } from '../../pages/customer/ServiceDetailPage';
import { WorkerMatchingPage } from '../../pages/customer/WorkerMatchingPage';
import { BookingTrackingPage } from '../../pages/customer/BookingTrackingPage';
import { CustomerHistoryPage } from '../../pages/customer/CustomerHistoryPage';
import { CustomerProfilePage } from '../../pages/customer/CustomerProfilePage';

export const CustomerShell: React.FC = () => {
  const { activeView } = useBooking();

  const isHome = activeView === 'home';

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
        return <CustomerProfilePage />;
      case 'home':
      default:
        return <CustomerHomePage />;
    }
  };

  return (
    <div
      className="container-marketplace animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-app)',
      }}
    >
      <Header />

      <main style={{ flex: 1, paddingBottom: '30px' }}>
        {isHome ? (
          renderActiveView()
        ) : (
          <div className="container-focused-flow">
            {renderActiveView()}
          </div>
        )}
      </main>

      <MarketplaceFooter />
      <BottomNav />
    </div>
  );
};
