import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Button,
  TextField,
  Grid,
  Badge,
  IconButton,
  Divider,
  Typography,
  Box,
  Paper,
  Stack
} from '@mui/material';

import { Edit, CameraAlt, Close, Lock, Settings } from '@mui/icons-material';

const AdminProfileDialog = ({ open, onClose }) => {
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Admin User",
    email: "admin@example.com",
    phone: "+1 234 567 890",
    position: "System Administrator",
    avatar: "AU"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({
          ...prev,
          avatar: reader.result,
          avatarText: ""
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          p: 2,
          maxWidth: '550px'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        pb: 1
      }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Admin Profile
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers sx={{ pt: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          mb: 4 
        }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <label htmlFor="avatar-upload">
                <IconButton
                  component="span"
                  sx={{ 
                    backgroundColor: '#4d75d4', 
                    color: 'white',
                    '&:hover': { backgroundColor: '#3a5fc8' },
                    cursor: editMode ? 'pointer' : 'default'
                  }}
                  disabled={!editMode}
                >
                  <CameraAlt fontSize="small" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                    disabled={!editMode}
                  />
                </IconButton>
              </label>
            }
          >
            {profileData.avatar.includes('data:image') ? (
              <Avatar
                src={profileData.avatar}
                sx={{
                  width: 120,
                  height: 120,
                  fontSize: '3rem',
                }}
              />
            ) : (
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  fontSize: '3rem',
                  backgroundColor: '#4d75d4',
                }}
              >
                {profileData.avatar}
              </Avatar>
            )}
          </Badge>
          <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
            {profileData.name}
          </Typography>
        </Box>


<Box display="flex" width="100%" justifySelf={'center'} gap={1}>
  <Box width="100%" gap={2} display={'flex'} justifySelf={'center'} alignItems={'center'} flexDirection={'column'}>
    <TextField
      label="Full Name"
      name="name"
      value={profileData.name}
      onChange={handleInputChange}
      fullWidth
      disabled={!editMode}
      variant="outlined"
    />
    <TextField
      label="Phone"
      name="phone"
      value={profileData.phone}
      onChange={handleInputChange}
      fullWidth
      disabled={!editMode}
      variant="outlined"
      sx={{ mt: 0}}
    />
    <TextField
      label="Email"
      name="email"
      value={profileData.email}
      onChange={handleInputChange}
      fullWidth
      disabled={!editMode}
      variant="outlined"
    />
  </Box>
</Box>

      </DialogContent>

      <DialogActions sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        p: 3,
        pt: 1
      }}>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Settings />}
            sx={{ 
              mr: 1,
              borderColor: '#4d75d4',
              color: '#4d75d4',
              '&:hover': {
                backgroundColor: '#4d75d410',
                borderColor: '#3a5fc8'
              }
            }}
          >
            Settings
          </Button>
          <Button
            variant="outlined"
            startIcon={<Lock />}
            sx={{ 
              borderColor: '#f44336',
              color: '#f44336',
              '&:hover': {
                backgroundColor: '#f4433610',
                borderColor: '#d32f2f'
              }
            }}
          >
            Lock
          </Button>
        </Box>
        
        <Box>
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => setEditMode(!editMode)}
            sx={{
              mr: 1,
              backgroundColor: editMode ? '#f44336' : '#4d75d4',
              '&:hover': {
                backgroundColor: editMode ? '#d32f2f' : '#3a5fc8',
              },
            }}
          >
            {editMode ? 'Cancel' : 'Edit'}
          </Button>
          {editMode && (
            <Button
              variant="contained"
              onClick={() => {
                setEditMode(false);
                // Save to backend would go here
              }}
              sx={{
                backgroundColor: '#2e7d32',
                '&:hover': {
                  backgroundColor: '#1b5e20',
                },
              }}
            >
              Save
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AdminProfileDialog;