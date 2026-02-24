import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  Divider,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Add, Delete, Send } from '@mui/icons-material';

const ReferInvitePage = () => {
  const [entries, setEntries] = useState([{
    email: '',
    mobile: '',
    name: '',
    relationship: '',
    channel: 'email'
  }]);

  const handleAddEntry = () => {
    setEntries([...entries, {
      email: '',
      mobile: '',
      name: '',
      relationship: '',
      channel: 'email'
    }]);
  };

  const handleDeleteEntry = (index) => {
    if (entries.length > 1) {
      const newEntries = [...entries];
      newEntries.splice(index, 1);
      setEntries(newEntries);
    }
  };

  const handleInputChange = (index, field, value) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
    setEntries(newEntries);
  };

  const handleSubmit = () => {
    console.log('Submitted entries:', entries);
    // Add your submission logic here
  };

  return (
    <Box sx={{
      p: 0,
      ml:{xs:0, md:2},
      mt:{xs:1, md:2}, 
      maxWidth: 900,
      borderRadius: 2
    }}>

     <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 4,
          color: 'primary.main',
          textAlign: 'center'
        }}
      >
        Invite Your Friends & Family
      </Typography>

      {/* Subheading */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          textAlign:  'center' 
        }}
      >
        <Send fontSize="large" /> Refer / Invite
      </Typography>

      <Divider sx={{ mb: 4 }} />

      {entries.map((entry, index) => (
        <React.Fragment key={index}>
            <Grid item xs={12} sm={3} mb={2}>
              <TextField
               sx={{width:'80%'}}
                label="Full Name"
                variant="outlined"
                value={entry.name}
                onChange={(e) => handleInputChange(index, 'name', e.target.value)}
              />
            </Grid>
             <Grid item xs={12} sm={3} mb={2}>
              <TextField
               sx={{width:'80%'}}
                fullWidth
                label="Email ID"
                variant="outlined"
                placeholder="example@domain.com"
                value={entry.email}
                onChange={(e) => handleInputChange(index, 'email', e.target.value)}
              />
            </Grid>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            
            
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Mobile No"
                variant="outlined"
                placeholder="9876543210"
                value={entry.mobile}
                onChange={(e) => handleInputChange(index, 'mobile', e.target.value)}
              />
            </Grid>

            
            <Grid item xs={12} sm={1} sx={{ display: 'flex', justifyContent: 'center' }}>
              <IconButton
                onClick={() => handleDeleteEntry(index)}
                disabled={entries.length <= 1}
                size='large'
                sx={{
                  '&:hover': {
                    background:'transparent',
                    color: 'red'
                  }
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Grid>
          </Grid>
          
          {index < entries.length - 1 && <Divider sx={{ my: 2 }} />}
        </React.Fragment>
      ))}

      <Box sx={{ display: 'flex',
         justifyContent: 'flex-start',
          mt: 3, gap:1.5 }}>
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={handleAddEntry}
           sx={{
            p:{xs:'10px', md:'10px'},
            textTransform:'capitalize',
                  '&:hover': {
                    background: 'transparent'
                }
              }}
        >
          Add Contact
        </Button>
        
        <Button
          variant="contained"
          endIcon={<Send />}
          onClick={handleSubmit}
          sx={{ px: 4, textTransform:'capitalize', 
             p:{xs:'10px', md:' 10px 15px'},
          }}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default ReferInvitePage;