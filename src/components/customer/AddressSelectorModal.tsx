import React, { useState } from 'react';
import { X, Search, Plus, Navigation, Home, Building, Check, MapPin } from 'lucide-react';

export interface SavedAddress {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  title: string;
  flat: string;
  building: string;
  locality: string;
  fullAddress: string;
  phone: string;
  isDefault?: boolean;
}

const DEFAULT_SAVED_ADDRESSES: SavedAddress[] = [
  {
    id: 'addr-1',
    type: 'Home',
    title: 'Home',
    flat: 'Flat 402',
    building: 'Green Vista Apartments',
    locality: '12th Main, Indiranagar, Bangalore',
    fullAddress: 'Flat 402, 4th Floor, Green Vista Apartments, 12th Main Indiranagar, Bangalore - 560038',
    phone: '+91 99801 22334',
    isDefault: true,
  },
  {
    id: 'addr-2',
    type: 'Work',
    title: 'Office',
    flat: 'Suite 3B',
    building: 'Tech Park Tower',
    locality: 'Sector 62, Noida',
    fullAddress: 'Suite 3B, 3rd Floor, Tech Park Tower, Sector 62, Noida - 201301',
    phone: '+91 99801 22334',
    isDefault: false,
  },
  {
    id: 'addr-3',
    type: 'Other',
    title: "Parents' Home",
    flat: 'House #12',
    building: 'Cooperative Enclave',
    locality: 'HSR Layout Sector 2, Bangalore',
    fullAddress: 'House #12, 1st Cross, Cooperative Enclave, HSR Layout Sector 2, Bangalore - 560102',
    phone: '+91 98765 11223',
    isDefault: false,
  },
];

interface AddressSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAddress: string;
  onSelectAddress: (address: string) => void;
  onAddNewAddress: () => void;
}

export const AddressSelectorModal: React.FC<AddressSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedAddress,
  onSelectAddress,
  onAddNewAddress,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [savedAddresses] = useState<SavedAddress[]>(DEFAULT_SAVED_ADDRESSES);
  const [activeAddressId, setActiveAddressId] = useState<string>('addr-1');

  if (!isOpen) return null;

  const handleSelect = (addr: SavedAddress) => {
    setActiveAddressId(addr.id);
    onSelectAddress(addr.fullAddress);
    onClose();
  };

  const handleUseLocationGPS = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          onSelectAddress('Indiranagar, Bangalore (Current GPS Location)');
          onClose();
        },
        () => {
          onSelectAddress('Indiranagar, Bangalore');
          onClose();
        }
      );
    } else {
      onSelectAddress('Indiranagar, Bangalore');
      onClose();
    }
  };

  const filteredAddresses = savedAddresses.filter((a) =>
    a.fullAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="animate-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        className="animate-slide-up"
        style={{
          width: '100%',
          maxWidth: '480px',
          maxHeight: '90vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px 24px 0 0',
          padding: '20px 20px 32px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -10px 30px rgba(0,0,0,0.15)',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Select your location
          </h2>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#F1F5F9',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748B',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            border: '1.5px solid #CBD5E1',
            borderRadius: '14px',
            padding: '11px 14px',
            backgroundColor: '#FFFFFF',
            gap: '8px',
            marginBottom: '16px',
          }}
        >
          <Search size={18} color="#64748B" />
          <input
            type="text"
            placeholder="Search locality, sector, area"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              width: '100%',
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: '#0F172A',
            }}
          />
        </div>

        {/* Action Buttons: Add Address & Use Current Location */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          <button
            type="button"
            onClick={handleUseLocationGPS}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              backgroundColor: '#F0FDF4',
              border: '1px solid var(--sahyog-sage, #D9E9C8)',
              borderRadius: '12px',
              color: 'var(--sahyog-green, #1DAA5C)',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <Navigation size={18} />
            <div style={{ flex: 1 }}>
              <div>Use current location</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--sahyog-green-dark, #0F7A3E)', fontWeight: 500 }}>
                Using GPS auto-detection
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onAddNewAddress();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              color: 'var(--sahyog-ink, #0B0B0B)',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <Plus size={18} color="var(--sahyog-green, #1DAA5C)" />
            <span>Add new address</span>
          </button>
        </div>

        {/* Saved Addresses Section */}
        <div>
          <div
            style={{
              fontSize: '0.6875rem',
              fontWeight: 800,
              color: '#64748B',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '10px',
            }}
          >
            SAVED ADDRESSES ({filteredAddresses.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredAddresses.map((addr) => {
              const isSelected = selectedAddress.includes(addr.locality) || activeAddressId === addr.id;
              return (
                <div
                  key={addr.id}
                  onClick={() => handleSelect(addr)}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '14px',
                    border: `1.5px solid ${isSelected ? 'var(--sahyog-green, #1DAA5C)' : '#E2E8F0'}`,
                    backgroundColor: isSelected ? '#F0FDF4' : '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '12px',
                    boxShadow: isSelected ? '0 2px 10px rgba(29, 170, 92, 0.1)' : 'none',
                    transition: 'all 150ms ease',
                  }}
                  className="hover-card"
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flex: 1 }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: isSelected ? '#DCFCE7' : '#F1F5F9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isSelected ? 'var(--sahyog-green, #1DAA5C)' : '#475569',
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    >
                      {addr.type === 'Home' ? <Home size={16} /> : addr.type === 'Work' ? <Building size={16} /> : <MapPin size={16} />}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--sahyog-ink, #0B0B0B)' }}>
                          {addr.title}
                        </span>
                        {isSelected && (
                          <span
                            style={{
                              fontSize: '0.5625rem',
                              fontWeight: 800,
                              backgroundColor: 'var(--sahyog-green, #1DAA5C)',
                              color: '#FFFFFF',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              textTransform: 'uppercase',
                            }}
                          >
                            Selected
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: '0.75rem', color: '#475569', lineHeight: 1.35, marginBottom: '4px' }}>
                        {addr.fullAddress}
                      </div>

                      <div style={{ fontSize: '0.6875rem', color: '#94A3B8', fontWeight: 500 }}>
                        Phone: {addr.phone}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {isSelected ? (
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--sahyog-green, #1DAA5C)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                        }}
                      >
                        <Check size={14} strokeWidth={3} />
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--sahyog-green, #1DAA5C)' }}>
                        Select
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
