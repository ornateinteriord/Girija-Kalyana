import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Divider, 
  Container,
  useTheme,
  useMediaQuery,
  Paper,
  List,
  ListItem,
  ListItemIcon
} from '@mui/material';
import { 
  CreditCard, 
  Shield, 
  VerifiedUser,
  CheckCircle,
  Star,
  Favorite,
  Lock,
  Public,
  PhoneAndroid
} from '@mui/icons-material';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import { membershipOptions } from "../../assets/memberShipOptions/MemberShipPlans";


const MembershipPlans = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  

  const benefits = [
    { icon: <Star color="primary" />, text: 'Premium quality matches' },
    { icon: <Favorite color="error" />, text: 'Higher response rates' },
    { icon: <Lock color="warning" />, text: 'Enhanced privacy controls' },
    { icon: <Public color="info" />, text: 'Nationwide reach' },
    { icon: <PhoneAndroid color="success" />, text: 'Dedicated mobile app' }
  ];

  return (
    <>
      <Navbar />
      <Box sx={{ 
        background: '#ffff',
        minHeight: '100vh',
        py:isMobile? 5.5 : 6
      }}>
        <Box width={'100%'} padding={'20px'}>
          <Typography 
            component="h1" 
            sx={{ 
                fontSize: isMobile? "26px":"50px",
              textAlign: 'center', 
              mb: 0,
              fontWeight: 700,
              color: theme.palette.primary.main,
              background: 'linear-gradient(90deg, #3f51b5, #9c27b0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Find Your Perfect Match
          </Typography>

         <Box
  sx={{
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    gap: 4,
    mt: 0,
  }}
>
  {/* Left Side - Description Container */}
  <Box
    sx={{
      flex: isMobile ? '1 1 100%' : '0 0 33%',
    }}
  >
    <Paper
      elevation={3}
      sx={{
     mt:isMobile?2:6,
        p: 4,
        borderRadius: 3,
        background: 'linear-gradient(145deg, #ffffff, #f5f5ff)',
        borderLeft: `6px solid ${theme.palette.primary.main}`,
        height: '100%',
      }}
    >
      <Typography
        sx={{
          fontSize:isMobile? "16px" : "25px",
          mb: 0,
          fontWeight: 600,
          color: theme.palette.primary.dark,
        }}
      >
        Why Choose Our Membership?
      </Typography>

      <List>
        {benefits.map((item, index) => (
          <ListItem key={index} sx={{ px: 0 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
            <Typography variant="body1">{item.text}</Typography>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ height:'1px',  my:isMobile?1:1 }} />

      <Typography variant="body1" sx={{ mb: 2 ,textAlign:'start'}}>
        Our membership plans are designed to help you find your perfect match with premium features and exclusive benefits.
      </Typography>

      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: '#f0f4ff',
          border: `1px dashed ${theme.palette.primary.light}`,
        }}
      >
        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
          "Join thousands of happy couples who found their life partners through our platform."
        </Typography>
      </Box>
    </Paper>
  </Box>

  {/* Right Side - Membership Plans */}
  <Box
    sx={{
      flex: isMobile ? '1 1 100%' : '0 0 67%',
    }}
  >
    <Typography
      variant="h4"
      component="h2"
      sx={{
        textAlign: isMobile ? 'center' : 'left',
        mb: 2,
        fontWeight: 600,
        color: theme.palette.text.secondary,
        textTransform:'capitalize'
      }}
    >
     Membership Plans
    </Typography>

    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
      }}
    >
      {membershipOptions.map((plan, index) => (
        <Box
          key={index}
          sx={{
            flex: '1 1 calc(50% - 12px)',
            minWidth: isMobile ? '100%' : 'auto',
          }}
        >
          <Card
            sx={{
                width:isMobile?'100%':'90%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 4,
              border: 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 8,
              },
              background: plan.gradient,
              color: 'white',
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative',
              '&:before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: 'rgba(255,255,255,0.3)',
              },
            }}
          >
            <CardContent
              sx={{
                flexGrow: 1,
                position: 'relative',
                zIndex: 1,
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top:isMobile? 55 : 16,
                  right: 16,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                {plan.discount}
              </Box>

              <Typography
                variant="h5"
                component="h3"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  color: 'white',
                }}
              >
                {plan.name}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                <Typography
                  variant="h3"
                  component="div"
                  sx={{
                    fontWeight: 800,
                    mr: 2,
                  }}
                >
                  {plan.discountedPrice}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    textDecoration: 'line-through',
                    opacity: 0.8,
                     color:'#fff'
                  }}
                >
                  {plan.originalPrice}
                </Typography>
              </Box>

              <Divider
                sx={{
                  height:'1px',
                  my: 2,
                  bgcolor: 'rgba(255,255,255,0.3)',
                }}
              />

              <List
                dense
                sx={{
                  mb: 1,
                  '& li': {
                    px: 0,
                    py: 0.5,
                  },
                }}
              >
                {plan.features.map((feature, i) => (
                  <ListItem
                    key={i}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                    }}
                  >
                    <CheckCircle
                      sx={{
                        fontSize: 18,
                        mr: 1.5,
                        mt: '2px',
                      }}
                    />
                    <Typography variant="body2" sx={{color:'#fff'}}>{feature}</Typography>
                  </ListItem>
                ))}
              </List>

              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  opacity: 0.9,
                }}
              >
                Validity: {plan.duration}
              </Typography>

              <Button
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  bgcolor: 'white',
                  color: plan.color,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                  },
                  py: 1.5,
                  fontWeight: 700,
                  borderRadius: 2,
                  boxShadow: 2,
                }}
              >
                Get Started
              </Button>

              <Typography
                variant="body2"
                sx={{
                  mt: 2,
                  textAlign: 'center',
                  opacity: 0.8,
                  color:'#fff'
                }}
              >
                Have Promocode? Get ₹100 discount
              </Typography>
            </CardContent>
          </Card>
        </Box>
      ))}
    </Box>
  </Box>
</Box>


          {/* Trust and Security Section */}
          <Box sx={{ 
            mt:isMobile? 4 :  8,
            textAlign: 'center',
            bgcolor: 'Background.paper',
            p: 4,
            borderRadius: 3,
            boxShadow: 2,
            border: `1px solid ${theme.palette.divider}`
          }}>
          <Typography 
  variant="h5" 
  sx={{ 
    mb:isMobile? 0 : 3,
    fontWeight: 600,
    color: theme => theme.palette.primary.main,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    flexDirection: { xs: 'column', sm: 'row' }, // stack on mobile, inline on larger screens
    textAlign: 'center', // center align text on small screens
  }}
>
  <VerifiedUser color="primary" sx={{ fontSize: 40 }} />
  Trusted By Thousands of Users
</Typography>

           <Box
  sx={{
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap:isMobile? 0 : 3,
    mt:isMobile? 0 : 4
  }}
>
  {/* Secure Payment */}
  <Box
    sx={{
      flex: '1 1 300px',
      p: 3,
      borderRadius: 2,
      bgcolor: '#f9f9ff',
      minWidth:isMobile?"100%": 280,
    }}
  >
    <Shield sx={{ fontSize: 50, color: theme.palette.success.main, mb: 1 }} />
    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
      Secure Payment
    </Typography>
    <Typography variant="body2">
      Your information is protected by 256-bit SSL encryption and secure payment gateways.
    </Typography>
  </Box>

  {/* Verified Profiles */}
  <Box
    sx={{
      flex: '1 1 300px',
      p: 3,
      borderRadius: 2,
      bgcolor: '#f9f9ff',
      minWidth:isMobile?"100%": 280,
    }}
  >
    <VerifiedUser sx={{ fontSize: 50, color: theme.palette.success.main, mb: 2 }} />
    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
      Verified Profiles
    </Typography>
    <Typography variant="body2">
      Every profile undergoes strict verification to ensure authenticity.
    </Typography>
  </Box>

  {/* Payment Options */}
  <Box
    sx={{
      flex: '1 1 300px',
      p: 3,
      borderRadius: 2,
      bgcolor: '#f9f9ff',
       minWidth:isMobile?"100%": 280,
    }}
  >
    <CreditCard sx={{ fontSize: 50, color: theme.palette.success.main, mb: 2 }} />
    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
      Payment Options
    </Typography>
    <Typography variant="body2" sx={{ mb: 1.5 }}>
      We accept all major payment methods:
    </Typography>
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
      {['visa', 'master', 'amex', 'paypal'].map((type, i) => (
        <Box
          key={i}
          component="img"
          src={`/${type}.png`}
          alt={type}
          sx={{ height: 34 }}
        />
      ))}
    </Box>
  </Box>
</Box>

          </Box>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default MembershipPlans;