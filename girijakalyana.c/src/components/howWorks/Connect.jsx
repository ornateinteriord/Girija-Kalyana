import React from 'react';
import { Container, Typography, Grid, Box, Paper, Badge, Card, CardContent } from '@mui/material';
import { FaUserEdit, FaUsers, FaComments, FaUserFriends, FaCalendarWeek, FaCalendarAlt, FaUserPlus } from 'react-icons/fa';
import { useGetDashboardStats } from '../api/Auth';

const Connect = () => {
  const { data: dashboardstats } = useGetDashboardStats();
  
const stats = [
    {
      id: 1,
      title: 'Profiles',
      value: `${dashboardstats?.stats?.totalProfiles || 0}`,
      icon: <FaUserFriends style={{ fontSize: 40, color: '#1a4f72' }} />,
      color: '#f8f9fa',
      textColor: 'rgb(192, 9, 88)',
     
    },
    {
      id: 2,
      title: 'This Week',
      value: `${dashboardstats?.stats?.thisWeekRegistrations || 0}`,
      icon: <FaCalendarWeek style={{ fontSize: 40, color: '#1a4f72' }} />,
      color: '#f8f9fa',
      textColor: '#00bcd4',
      
    },
    {
      id: 3,
      title: 'This Month',
      value: `${dashboardstats?.stats?.thisMonthRegistrations || 0}`,
      icon: <FaCalendarAlt style={{ fontSize: 40, color: '#1a4f72' }} />,
      color: '#f8f9fa',
      textColor: '#ff5a5f',
     
    },
  ];

  const features = [
    {
      id: 1,
      title: 'Sign Up',
      description: 'Register for free & put up your Matrimony Profile',
      icon: <FaUserEdit style={{ fontSize: 50, color: '#fff' }} />,
    },
    {
      id: 2,
      title: 'Connect',
      description: 'Select & Connect with Matches you like',
      icon: <FaUsers style={{ fontSize: 50, color: '#fff' }} />,
    },
    {
      id: 3,
      title: 'Interact',
      description: 'Become a Premium Member & Start a Conversation',
      icon: <FaComments style={{ fontSize: 50, color: '#fff' }} />,
    },
  ];

  return (
    <>
     <Container maxWidth="xl" sx={{ 
  py: { xs: 4, md: 4 },
  fontFamily: "Outfit",
}}>
  <Box sx={{
    maxWidth: "100%",
    mx: 'auto',
    px: { xs: 2, sm: 4 },
  }}>
    <Typography variant="h4" sx={{ 
     
      color: '#1a4f72', 
      textAlign: 'center',
      fontSize: { xs: '1.75rem', md: '2.125rem' }
    }}>
      Platform Statistics
    </Typography>
    
    <Grid container spacing={{ xs: 2, md: 5 }} justifyContent="center">
      {stats.map((stat) => (
        <Grid item xs={12} sm={6} md={4} key={stat.id} sx={{
          display: 'flex',
        }}>
          <Card sx={{ 
             width: { xs: '100%', sm: '280px' }, 
             maxWidth: 340,
            height: '100%',
            minHeight: 220,
            borderRadius: 3,
            backgroundColor: 'transparent', 
            boxShadow: 'none', 
            display: 'flex',
            flexDirection: 'column',
            border: 'none',
            
          }}>
            <CardContent sx={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: { xs: 3, md: 3 },
            }}>
              <Box sx={{ 
                display: 'inline-flex',
                p: 2,
                mb: 2,
                borderRadius: '50%',
                color: "#1a4f72"
              }}>
                {stat.icon}
              </Box>
              <Typography variant="h6" sx={{ 
                color: "gray",
                fontWeight: 600,
                mb: 1.5,
                fontSize: { xs: '1.1rem', md: '1.30rem' }
              }}>
                {stat.title}
              </Typography>
              <Typography variant="h4" sx={{ 
                color: "#000",
                fontWeight: 700,
                fontSize: { xs: '1.5rem', md: '1.7rem' },
                lineHeight: 1.2
              }}>
                {stat.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
</Container>

      <Container sx={{ textAlign: 'center', marginTop: {xs:0,md:5}, fontFamily: "Outfit" }}>
        <Typography variant="h4" sx={{ marginBottom: 4, color: '#1a4f72', fontFamily: "Outfit sans-serif" }}>
          Find your Special Someone
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {features.map((feature) => (
            <Grid item xs={12} sm={4} key={feature.id}>
              <Badge
                badgeContent={feature.id}
                color="error"
                overlap="circular"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '1rem',
                    height: '24px',
                    minWidth: '24px',
                    borderRadius: '50%',
                    top: 10,
                    right: 10,
                    backgroundColor: '#fff',
                    color: '#000',
                    border: '2px solid #00bcd4',
                  },
                }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    padding: 3,
                    borderRadius: '50%',
                    backgroundColor: '#1a4f72',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 90,
                    height: 90,
                    margin: '0 auto',
                  }}
                >
                  {feature.icon}
                </Paper>
              </Badge>
              <Box sx={{ marginTop: 2 }}>
                <Typography variant="h6" sx={{ color: '#00bcd4', fontFamily: "Outfit sans-serif" }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#777', fontFamily: "Outfit sans-serif" }}>
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}

export default Connect;