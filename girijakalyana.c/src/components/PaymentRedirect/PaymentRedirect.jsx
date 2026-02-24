import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  CircularProgress, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import { Close as CloseIcon, Error as ErrorIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { useVerifyPayment, useRaiseTicket } from '../api/Payment';

const PaymentRedirect = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
  const [ticketDescription, setTicketDescription] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [uploadedImages, setUploadedImages] = useState([]);
  
  const verifyPayment = useVerifyPayment();
  const raiseTicketMutation = useRaiseTicket();
  const hasVerified = useRef(false);
  const verificationTimeout = useRef(null);
  
  const orderId = searchParams.get('order_id');
  
  useEffect(() => {
    if (orderId && !hasVerified.current) {
      hasVerified.current = true;
      verifyPaymentStatus();
    }
    
    // Cleanup function to clear timeout
    return () => {
      if (verificationTimeout.current) {
        clearTimeout(verificationTimeout.current);
      }
    };
  }, [orderId]);
  
  const verifyPaymentStatus = async () => {
    if (!orderId || orderId.includes('{') || orderId.includes('}')) {
      setVerificationStatus({ success: false, message: 'Invalid order ID' });
      return;
    }
    
    // Prevent duplicate calls
    if (isVerifying) {
      return;
    }
    
    setIsVerifying(true);
    
    try {
      const response = await verifyPayment.mutateAsync({ orderId });
      setVerificationStatus(response);
      
      // Auto-redirect after successful verification
      if (response.success) {
        verificationTimeout.current = setTimeout(() => {
          navigate('/user/userDashboard');
        }, 3000);
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

  const handleOpenTicketDialog = () => {
    setTicketDialogOpen(true);
  };

  const handleCloseTicketDialog = () => {
    setTicketDialogOpen(false);
    setTicketDescription('');
    setUploadedImages([]);
  };

  const handleRaiseTicket = async () => {
    if (!ticketDescription.trim()) {
      setSnackbar({ open: true, message: 'Please provide a description for your issue', severity: 'error' });
      return;
    }

    // Prevent duplicate calls
    if (raiseTicketMutation.isPending) {
      return;
    }

    try {
      await raiseTicketMutation.mutateAsync({ 
        orderId, 
        description: ticketDescription,
        images: uploadedImages
      });
      
      // Use only snackbar, not toast
      setSnackbar({ open: true, message: 'Ticket raised successfully! Our team will review your issue.', severity: 'success' });
      handleCloseTicketDialog();
    } catch (error) {
      // Use only snackbar, not toast
      setSnackbar({ open: true, message: 'Failed to raise ticket. Please try again.', severity: 'error' });
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + uploadedImages.length > 5) {
      setSnackbar({ open: true, message: 'You can upload maximum 5 images', severity: 'error' });
      return;
    }
    
    // Don't read file content here, just store the files
    setUploadedImages(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      p: 2,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card sx={{ 
        width: '100%', 
        maxWidth: 600, 
        textAlign: 'center', 
        p: 4, 
        boxShadow: 24,
        borderRadius: 4
      }}>
        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
            Payment Status
          </Typography>
          
          {isVerifying ? (
            <>
              <CircularProgress size={60} sx={{ mb: 3, mt: 2 }} />
              <Typography variant="h6" color="textSecondary" sx={{ mb: 3 }}>
                Verifying your payment...
              </Typography>
            </>
          ) : verificationStatus ? (
            <>
              {verificationStatus.success ? (
                <>
                  <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                  <Typography variant="h5" color="success.main" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Payment Successful!
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    Your payment has been verified successfully. Redirecting to dashboard...
                  </Typography>
                </>
              ) : (
                <>
                  <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
                  <Typography variant="h5" color="error.main" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Payment Failed
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {verificationStatus.message || 'Payment verification failed.'}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3, backgroundColor: '#ffebee', p: 2, borderRadius: 1 }}>
                    <strong>Order Status:</strong> {verificationStatus.orderStatus || 'Unknown'}<br />
                    <strong>Payment Status:</strong> {verificationStatus.paymentStatus || 'Unknown'}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      onClick={handleOpenTicketDialog}
                    >
                      Raise a Ticket
                    </Button>
                  </Box>
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
            sx={{ mt: 2 }}
          >
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>

      {/* Ticket Dialog */}
      <Dialog open={ticketDialogOpen} onClose={handleCloseTicketDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Raise a Support Ticket
          <IconButton
            aria-label="close"
            onClick={handleCloseTicketDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Order ID: <strong>{orderId}</strong>
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Describe your issue"
            fullWidth
            multiline
            rows={4}
            value={ticketDescription}
            onChange={(e) => setTicketDescription(e.target.value)}
            variant="outlined"
          />
          
          <Box sx={{ mt: 2 }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="upload-images"
              multiple
              type="file"
              onChange={handleImageUpload}
            />
            <label htmlFor="upload-images">
              <Button variant="outlined" component="span" sx={{ mr: 2 }}>
                Upload Images
              </Button>
            </label>
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Upload up to 5 images (optional)
            </Typography>
          </Box>
          
          {uploadedImages.length > 0 && (
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {uploadedImages.map((file, index) => (
                <Box key={index} sx={{ position: 'relative' }}>
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt={`upload-${index}`} 
                    style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }} 
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <IconButton 
                    size="small" 
                    onClick={() => removeImage(index)}
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      backgroundColor: 'white',
                      minWidth: 0,
                      minHeight: 0,
                      padding: '2px'
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTicketDialog} disabled={raiseTicketMutation.isPending}>
            Cancel
          </Button>
          <Button 
            onClick={handleRaiseTicket} 
            variant="contained" 
            color="primary"
            disabled={raiseTicketMutation.isPending}
          >
            {raiseTicketMutation.isPending ? 'Raising...' : 'Raise Ticket'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PaymentRedirect;