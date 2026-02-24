import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { Close, AddAPhoto } from '@mui/icons-material';
import { toast } from 'react-toastify';

const IncompletePaymentTicket = ({ orderId, open, onClose, onSubmit, isLoading }) => {
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [manualOrderId, setManualOrderId] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + images.length > 5) {
      toast.error('You can upload maximum 5 images');
      return;
    }
    
    const newImages = [];
    const newPreviews = [];
    
    files.forEach((file) => {
      if (!file.type.match('image.*')) {
        toast.error('Please upload only image files');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      newImages.push(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target.result);
        if (newPreviews.length === files.length) {
          setImages(prev => [...prev, ...newImages]);
          setImagePreviews(prev => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      setSnackbar({
        open: true,
        message: 'Please provide a description',
        severity: 'error'
      });
      return;
    }
    
    const finalOrderId = orderId || manualOrderId;
    if (!finalOrderId) {
      setSnackbar({
        open: true,
        message: 'Please provide an Order ID',
        severity: 'error'
      });
      return;
    }
    
    // Call the onSubmit prop passed from parent
    if (onSubmit) {
      onSubmit(finalOrderId, description, images);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      setDescription('');
      setImages([]);
      setImagePreviews([]);
      setManualOrderId('');
    }
  }, [open]);

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Raise Ticket for Incomplete Payment</Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {orderId ? (
              <Typography variant="body1" gutterBottom>
                <strong>Order ID:</strong> {orderId}
              </Typography>
            ) : (
              <TextField
                label="Order ID"
                value={manualOrderId}
                onChange={(e) => setManualOrderId(e.target.value)}
                fullWidth
                margin="normal"
                helperText="Please enter the Order ID for the incomplete payment"
                required
              />
            )}
            
            <TextField
              label="Description"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              margin="normal"
              helperText="Please describe the issue you're facing with this payment"
              required
            />
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Upload Images (Max 5 images, 5MB each)
              </Typography>
              
              <Button
                variant="outlined"
                component="label"
                startIcon={<AddAPhoto />}
                sx={{ mb: 2 }}
              >
                Add Images
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
              </Button>
              
              {imagePreviews.length > 0 && (
                <ImageList cols={3} rowHeight={164}>
                  {imagePreviews.map((preview, index) => (
                    <ImageListItem key={index}>
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        loading="lazy"
                      />
                      <ImageListItemBar
                        actionIcon={
                          <IconButton
                            sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                            onClick={() => removeImage(index)}
                          >
                            <Close />
                          </IconButton>
                        }
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              )}
            </Box>
            
            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <CircularProgress />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={isLoading || !description.trim()}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Submit Ticket'}
          </Button>
        </DialogActions>
      </Dialog>
      
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
    </>
  );
};

export default IncompletePaymentTicket;