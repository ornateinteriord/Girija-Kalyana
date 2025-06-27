import React, { useState } from 'react';
import { 
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  TextField,
  Divider,
  useTheme,
  useMediaQuery,
  Button,
  Card
} from '@mui/material';
import { 
  AccountBalance, 
  Person,
  Save
} from '@mui/icons-material';

function ProfilePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [value, setValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <Box  sx={{ 
      p: isMobile ? 0 : "0px 20px", 
       width:'100%'
    }}>
      {/* Header */}
      <Typography 
        variant="h3" 
        component="h1" 
        gutterBottom 
        sx={{ 
          textAlign: 'center', 
          mb: 1,
          fontWeight: 700,
          color: theme.palette.primary.main
        }}
      >
        My Profile
      </Typography>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0}}>
        {isEditing ? (
          <Button
            variant="contained"
            color="primary"
            startIcon={<Save />}
            onClick={handleSave}
            sx={{
                fontWeight:'bold',
              p:'12px',
              textTransform:'capitalize',
              '&:hover': {
                backgroundColor: theme.palette.primary.main 
              }
            }}
          >
            Save Profile
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="primary"
            onClick={handleEdit}
            sx={{
              fontWeight:'bold',
                p:'12px',
                 textTransform:'capitalize',
              '&:hover': {
                backgroundColor: 'transparent' // Remove hover effect
              }
            }}
          >
            Edit Profile
          </Button>
        )}
      </Box>

      {/* Tabs */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1}}>
        <Tabs 
          value={value} 
          onChange={handleChange}
          variant={isMobile ? 'scrollable' : 'standard'}
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
             width:'100%',
            '& .MuiTab-root': {
              '&:hover': {
                backgroundColor: 'transparent' 
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.primary.main
            }
          }}
        >
          <Tab 
            label="About" 
            icon={<Person />} 
            iconPosition="start" 
            sx={{
              '&:hover': {
                backgroundColor: 'transparent'
              }
            }}
          />
          <Tab 
            label="Bank Details" 
            icon={<AccountBalance />} 
            iconPosition="start" 
            sx={{
              '&:hover': {
                backgroundColor: 'transparent'
              }
            }}
          />
        </Tabs>
      </Box>

      {/* About Section */}
      {value === 0 && (
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 3 }}>
          {/* Basic Information */}
          <Box  sx={{ 
          p:isMobile? 0 : 2, 
            borderRadius: 2, 
            flex: 1,
            '&:hover': {
              boxShadow: 0 // Remove hover effect
            }
          }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
              Basic Information
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                name="fullName"
                label="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                variant="outlined"
                disabled={!isEditing}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.23)' // Maintain same border color on hover
                    }
                  }
                }}
              />

              <TextField
                fullWidth
                name="email"
                label="Email Id"
                value={formData.email}
                onChange={handleInputChange}
                variant="outlined"
                disabled={!isEditing}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.23)'
                    }
                  }
                }}
              />

              <TextField
                fullWidth
                name="phone"
                label="Phone No."
                value={formData.phone}
                onChange={handleInputChange}
                variant="outlined"
                disabled={!isEditing}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.23)'
                    }
                  }
                }}
              />
            </Box>
          </Box>

          {/* Address Information */}
          <Box  sx={{ 
             p:isMobile? 0 : 2, 
            borderRadius: 2, 
            flex: 1,
            '&:hover': {
              boxShadow: 0
            }
          }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
              Address Information
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                name="address"
                label="Address"
                value={formData.address}
                onChange={handleInputChange}
                variant="outlined"
                disabled={!isEditing}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.23)'
                    }
                  }
                }}
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  name="pinCode"
                  label="Pin Code"
                  value={formData.pinCode}
                  onChange={handleInputChange}
                  variant="outlined"
                  disabled={!isEditing}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0, 0, 0, 0.23)'
                      }
                    }
                  }}
                />
                <TextField
                  fullWidth
                  name="country"
                  label="Country"
                  value={formData.country}
                  onChange={handleInputChange}
                  variant="outlined"
                  disabled={!isEditing}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0, 0, 0, 0.23)'
                      }
                    }
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  name="state"
                  label="State"
                  value={formData.state}
                  onChange={handleInputChange}
                  variant="outlined"
                  disabled={!isEditing}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0, 0, 0, 0.23)'
                      }
                    }
                  }}
                />
                <TextField
                  fullWidth
                  name="city"
                  label="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  variant="outlined"
                  disabled={!isEditing}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0, 0, 0, 0.23)'
                      }
                    }
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {/* Bank Details Section */}
      {value === 1 && (
        <Box sx={{ 
          p:isMobile? 0 : 2, 
          borderRadius: 2,
          '&:hover': {
            boxShadow: 0
          }
        }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
            Bank Information
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              name="accountName"
              label="Account Name"
              value={formData.accountName}
              onChange={handleInputChange}
              variant="outlined"
              disabled={!isEditing}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.23)'
                  }
                }
              }}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                name="accountNumber"
                label="Account No"
                value={formData.accountNumber}
                onChange={handleInputChange}
                variant="outlined"
                disabled={!isEditing}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.23)'
                    }
                  }
                }}
              />
              <TextField
                fullWidth
                name="accountType"
                label="Account Type"
                value={formData.accountType}
                onChange={handleInputChange}
                variant="outlined"
                disabled={!isEditing}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.23)'
                    }
                  }
                }}
              />
            </Box>

            <TextField
              fullWidth
              name="ifscCode"
              label="IFSC Code"
              value={formData.ifscCode}
              onChange={handleInputChange}
              variant="outlined"
              disabled={!isEditing}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.23)'
                  }
                }
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default ProfilePage;