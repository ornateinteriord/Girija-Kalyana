import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button, CircularProgress } from '@mui/material';
import { useVerifyPayment } from '../api/Payment';

const PaymentRedirect = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  
  const verifyPayment = useVerifyPayment();
  
  const orderId = searchParams.get('order_id');
  
  useEffect(() => {
    if (orderId) {
      verifyPaymentStatus();
    }
  }, [orderId]);
  
  const verifyPaymentStatus = async () => {
    if (!orderId || orderId.includes('{') || orderId.includes('}')) {
      setVerificationStatus({ success: false, message: 'Invalid order ID' });
      return;
    }
    
    setIsVerifying(true);
    
    try {
      const response = await verifyPayment.mutateAsync({ orderId });
      setVerificationStatus(response);
      
      // Auto-redirect after successful verification
      if (response.success) {
        setTimeout(() => {
          navigate('/user/userDashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setVerificationStatus({ 
        success: false, 
        message: 'Payment verification failed. Please check your dashboard.' 
      });
    } finally {
      setIsVerifying(false);
    }
  };
  
  const handleGoToDashboard = () => {
    navigate('/user/userDashboard');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Card sx={{ maxWidth: 400, textAlign: 'center', p: 4, boxShadow: 10 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Payment Status
          </Typography>
          
          {isVerifying ? (
            <>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                Verifying your payment...
              </Typography>
            </>
          ) : verificationStatus ? (
            <>
              {verificationStatus.success ? (
                <>
                  <Typography variant="body1" color="success.main" sx={{ mb: 3 }}>
                    Payment verified successfully! Redirecting to dashboard...
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant="body1" color="error.main" sx={{ mb: 3 }}>
                    {verificationStatus.message || 'Payment verification failed.'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                    Order Status: {verificationStatus.orderStatus || 'Unknown'}
                    <br />
                    Payment Status: {verificationStatus.paymentStatus || 'Unknown'}
                  </Typography>
                </>
              )}
            </>
          ) : (
            <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
              {orderId ? 'Ready to verify payment...' : 'No order ID found. Please check your dashboard.'}
            </Typography>
          )}
          
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleGoToDashboard}
            disabled={isVerifying}
          >
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaymentRedirect;