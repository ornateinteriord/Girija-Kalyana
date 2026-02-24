import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TestPlanSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const planType = searchParams.get("type");
  const promocode = searchParams.get("promocode");

  const testPlanSelection = () => {
    // Test Silver plan
    navigate('/register?type=SilverUser&promocode=TEST100');
  };

  const testPremiumSelection = () => {
    // Test Premium plan
    navigate('/register?type=PremiumUser');
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Test Plan Selection</h1>
      <div style={{ margin: '20px 0' }}>
        <p>Current URL: {location.pathname + location.search}</p>
        <p>Plan Type: {planType || 'None'}</p>
        <p>Promocode: {promocode || 'None'}</p>
      </div>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button onClick={testPlanSelection} style={{ padding: '10px 20px' }}>
          Test Silver Plan with Promocode
        </button>
        <button onClick={testPremiumSelection} style={{ padding: '10px 20px' }}>
          Test Premium Plan
        </button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <a href="/membership-plan" style={{ color: 'blue' }}>Go to Membership Plans</a>
      </div>
    </div>
  );
};

export default TestPlanSelection;