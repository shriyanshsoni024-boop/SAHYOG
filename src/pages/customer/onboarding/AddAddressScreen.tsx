import React, { useState } from 'react';
import { ArrowLeft, Home, Building, MapPin, User, Phone, CheckCircle2 } from 'lucide-react';

interface AddAddressScreenProps {
  initialLocation: string;
  onSaveAddress: (addressData: {
    type: 'Home' | 'Other';
    flatNo: string;
    floor: string;
    buildingName: string;
    landmark: string;
    locality: string;
    receiverName: string;
    receiverPhone: string;
    fullAddress: string;
  }) => void;
  onBack: () => void;
  onChangeLocation: () => void;
}

export const AddAddressScreen: React.FC<AddAddressScreenProps> = ({
  initialLocation,
  onSaveAddress,
  onBack,
  onChangeLocation,
}) => {
  const [addressType, setAddressType] = useState<'Home' | 'Other'>('Home');
  const [flatNo, setFlatNo] = useState('');
  const [floor, setFloor] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [landmark, setLandmark] = useState('');
  const [receiverName, setReceiverName] = useState('Ananya Deshmukh');
  const [receiverPhone, setReceiverPhone] = useState('9980122334');

  const isValid = flatNo.trim().length > 0 &&
                  buildingName.trim().length > 0 &&
                  receiverName.trim().length > 0 &&
                  receiverPhone.trim().length >= 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      const full = `${flatNo}, ${floor ? `Floor ${floor}, ` : ''}${buildingName}, ${landmark ? `Near ${landmark}, ` : ''}${initialLocation}`;
      onSaveAddress({
        type: addressType,
        flatNo: flatNo.trim(),
        floor: floor.trim(),
        buildingName: buildingName.trim(),
        landmark: landmark.trim(),
        locality: initialLocation,
        receiverName: receiverName.trim(),
        receiverPhone: receiverPhone.trim(),
        fullAddress: full,
      });
    }
  };

  const handleQuickFill = () => {
    setFlatNo('Flat 402');
    setFloor('4th');
    setBuildingName('Green Vista Apartments');
    setLandmark('Opposite BDA Complex');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#F8FAFC',
        padding: '16px 16px 28px',
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#1E293B',
          }}
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
          Add address details
        </h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
        {/* 1. Address Details Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            border: '1px solid #E2E8F0',
            padding: '18px 16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0F172A' }}>
            Address details
          </div>

          {/* Segmented Buttons: Save address as */}
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '6px' }}>
              Save address as
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setAddressType('Home')}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: `1.5px solid ${addressType === 'Home' ? '#0C831F' : '#E2E8F0'}`,
                  backgroundColor: addressType === 'Home' ? '#F0FDF4' : '#FFFFFF',
                  color: addressType === 'Home' ? '#0C831F' : '#475569',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 120ms ease',
                }}
              >
                <Home size={15} />
                <span>Home</span>
              </button>

              <button
                type="button"
                onClick={() => setAddressType('Other')}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: `1.5px solid ${addressType === 'Other' ? '#0C831F' : '#E2E8F0'}`,
                  backgroundColor: addressType === 'Other' ? '#F0FDF4' : '#FFFFFF',
                  color: addressType === 'Other' ? '#0C831F' : '#475569',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 120ms ease',
                }}
              >
                <Building size={15} />
                <span>Other</span>
              </button>
            </div>
          </div>

          {/* Flat / House No & Floor in 2 columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Flat/House No.*
              </label>
              <input
                type="text"
                placeholder="e.g. 402"
                value={flatNo}
                onChange={(e) => setFlatNo(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 12px',
                  borderRadius: '10px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#0F172A',
                  outline: 'none',
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Floor (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 4th Floor"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 12px',
                  borderRadius: '10px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#0F172A',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Apartment / Building name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
              Apartment / Building name*
            </label>
            <input
              type="text"
              placeholder="e.g. Green Vista Apartments"
              value={buildingName}
              onChange={(e) => setBuildingName(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 12px',
                borderRadius: '10px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#0F172A',
                outline: 'none',
              }}
              required
            />
          </div>

          {/* Nearby Landmark */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
              Nearby Landmark (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Opposite BDA Complex"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 12px',
                borderRadius: '10px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#0F172A',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* 2. Area Summary Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            border: '1px solid #E2E8F0',
            padding: '14px 16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <MapPin size={20} color="#0C831F" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
                Area / Sector / Locality*
              </span>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>
                {initialLocation}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onChangeLocation}
            style={{
              background: 'none',
              border: 'none',
              color: '#0C831F',
              fontSize: '0.8125rem',
              fontWeight: 800,
              cursor: 'pointer',
              padding: '6px 8px',
            }}
          >
            Change
          </button>
        </div>

        {/* 3. Receiver Details Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            border: '1px solid #E2E8F0',
            padding: '18px 16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0F172A' }}>
              Receiver details
            </div>
            <p style={{ fontSize: '0.6875rem', color: '#64748B', margin: '2px 0 0' }}>
              Our professional will reach out to you on this number.
            </p>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
              Receiver's phone number*
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #CBD5E1', borderRadius: '10px', padding: '10px 12px', gap: '8px' }}>
              <Phone size={16} color="#64748B" />
              <input
                type="tel"
                value={receiverPhone}
                onChange={(e) => setReceiverPhone(e.target.value)}
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
              Receiver's name*
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #CBD5E1', borderRadius: '10px', padding: '10px 12px', gap: '8px' }}>
              <User size={16} color="#64748B" />
              <input
                type="text"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}
                required
              />
            </div>
          </div>
        </div>

        {/* 4. Sticky Bottom Save Address CTA */}
        <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
          <button
            type="submit"
            disabled={!isValid}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: isValid ? '#0C831F' : '#E2E8F0',
              color: isValid ? '#FFFFFF' : '#94A3B8',
              border: 'none',
              borderRadius: '14px',
              fontSize: '1rem',
              fontWeight: 800,
              cursor: isValid ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: isValid ? '0 4px 16px rgba(12, 131, 31, 0.3)' : 'none',
              transition: 'all 200ms ease',
            }}
          >
            <span>Save address</span>
            <CheckCircle2 size={18} />
          </button>

          {/* Quick Demo Fill */}
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <button
              type="button"
              onClick={handleQuickFill}
              style={{
                background: 'none',
                border: 'none',
                color: '#0C831F',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              ⚡ Fill Sample: Flat 402, Green Vista Apartments
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
