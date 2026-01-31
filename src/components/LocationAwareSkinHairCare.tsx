import React, { useState } from 'react';

// Mock climate inference based on location (frontend-only)
const getClimateFromLocation = (location: string): { type: string; temp: string; humidity: string; pollution: string } => {
  const climates: Record<string, any> = {
    'Jaipur': { type: 'Dry & hot', temp: 'High', humidity: 'Low', pollution: 'Medium' },
    'Mumbai': { type: 'Hot & humid', temp: 'High', humidity: 'High', pollution: 'High' },
    'Delhi': { type: 'High pollution exposure', temp: 'Moderate', humidity: 'Low', pollution: 'Very High' },
    // Add more mappings as needed
    default: { type: 'Moderate / mixed', temp: 'Moderate', humidity: 'Moderate', pollution: 'Low' }
  };
  return climates[location.toLowerCase()] || climates.default;
};

// Mock nearby support data
const getNearbySupport = (location: string) => ({
  clinics: [
    { name: 'SkinCare Clinic', area: 'Downtown', contact: '123-456-7890' },
    { name: 'DermaCare Center', area: 'Uptown', contact: '987-654-3210' }
  ],
  stores: [
    { name: 'PharmaPlus', address: '123 Main St' },
    { name: 'Beauty Essentials', address: '456 Elm Ave' }
  ]
});

const LocationAwareSkinHairCare: React.FC = () => {
  const [step, setStep] = useState(1); // 1: Input, 2: Display
  const [location, setLocation] = useState('');
  const [submittedLocation, setSubmittedLocation] = useState('');
  const [showNearby, setShowNearby] = useState(false);

  const handleSubmit = () => {
    if (location.trim()) {
      setSubmittedLocation(location);
      setStep(2);
    }
  };

  const climate = submittedLocation ? getClimateFromLocation(submittedLocation) : null;
  const nearby = submittedLocation ? getNearbySupport(submittedLocation) : null;

  return (
    <div className="location-aware-section" style={{ backgroundColor: '#1a1a1a', color: '#fff', padding: '20px', borderRadius: '10px' }}>
      {step === 1 && (
        <div className="card glow-hover" style={{ border: '2px solid #4CAF50', transition: 'box-shadow 0.3s' }}>
          <h2>Enter Your Location</h2>
          <input
            type="text"
            placeholder="City / Area / Pincode"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          />
          <button onClick={handleSubmit} style={{ backgroundColor: '#4CAF50', color: '#fff', padding: '10px 20px' }}>Submit</button>
        </div>
      )}

      {step === 2 && (
        <>
          <div className="context-badge" style={{ backgroundColor: '#333', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>
            Care optimized for: {submittedLocation}
          </div>

          {climate && (
            <div className="climate-insights">
              <h3>Climate Insights</h3>
              <div className="card glow-hover" style={{ border: '2px solid #2196F3', display: 'flex', justifyContent: 'space-around' }}>
                <div>🌡️ Temp: {climate.temp}</div>
                <div>💧 Humidity: {climate.humidity}</div>
                <div>🌫️ Pollution: {climate.pollution}</div>
              </div>
            </div>
          )}

          {/* Adapted Skincare Card (Mock Adaptation) */}
          <div className="card glow-hover" style={{ border: '2px solid #FF9800', marginTop: '20px' }}>
            <h3>Skincare Recommendation</h3>
            <p>Use hydrating serums with hyaluronic acid.</p>
            <h4>Why this works for your location</h4>
            <p>In {climate?.type} conditions, focus on moisture retention to combat dryness.</p>
          </div>

          {/* Adapted Haircare Card (Mock Adaptation) */}
          <div className="card glow-hover" style={{ border: '2px solid #E91E63', marginTop: '20px' }}>
            <h3>Haircare Recommendation</h3>
            <p>Apply oil treatments weekly.</p>
            <h4>Why this works for your location</h4>
            <p>For {climate?.type} environments, oils protect against environmental damage.</p>
          </div>

          <div className="nearby-support" style={{ marginTop: '20px' }}>
            <button onClick={() => setShowNearby(!showNearby)} style={{ backgroundColor: '#9C27B0', color: '#fff', padding: '10px' }}>
              {showNearby ? 'Hide' : 'Show'} Nearby Skin & Hair Care Support
            </button>
            {showNearby && nearby && (
              <div>
                <h4>Dermatology Clinics</h4>
                {nearby.clinics.map((clinic, idx) => (
                  <div key={idx} className="card" style={{ border: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}>
                    <p><strong>{clinic.name}</strong> - {clinic.area} - {clinic.contact}</p>
                  </div>
                ))}
                <h4>Local Stores</h4>
                {nearby.stores.map((store, idx) => (
                  <div key={idx} className="card" style={{ border: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}>
                    <p><strong>{store.name}</strong> - {store.address}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LocationAwareSkinHairCare;
