import React from 'react';
import {
  Box,
  Typography,
  Divider,
  Card,
  CardContent,
  Avatar,
  Chip,
  useTheme
} from '@mui/material';
import {
  Event,
  Logout,
  Dashboard,
  Person,
  Share,
  Search,
  ManageSearch,
  ImageSearch,
  TrendingUp,
  ArrowDropDown as ArrowDropDownIcon,
  Pending,
  CheckCircle,
  TimerOff,
  Groups,
  HowToReg,
  SupportAgent,
  Autorenew,
  Send,
  Inbox,
  AttachMoney,
  AccountBalanceWallet,
  Favorite,
  GroupAdd,
  PersonOff,
  PendingActions,
  TaskAlt,
  Settings,
  Lock,
  Notifications,
  Email
} from '@mui/icons-material';
import { useLoginMutation } from '../../api/Auth';
import { usePromoters } from '../../api/Admin';


const DashboardContent = ({ sidebarData }) => {
  const theme = useTheme();
  const { data: promoter, isLoading, error } = useLoginMutation();


  console.log("promoter user",promoter)

  const getIconComponent = (iconName, props = {}) => {
    const iconComponents = {
    Logout,
    Dashboard,
    Person,
    Share,
    Search,
    ManageSearch,
    ImageSearch,
    TrendingUp,
    ArrowDropDown: ArrowDropDownIcon,
    Pending,
    CheckCircle,
    TimerOff,
    Groups,
    HowToReg,
    SupportAgent,
    Autorenew,
    Send,
    Inbox,
    AttachMoney,
    AccountBalanceWallet,
    Favorite,
    GroupAdd,
    PersonOff,
    PendingActions,
    TaskAlt,
    Event,
    Settings,
    Lock,
    Notifications,
    Email,
  };
    
    const IconComponent = iconComponents[iconName];
    return IconComponent ? <IconComponent {...props} /> : null;
  };

  return (
    <>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          color: '#4a148c',
          fontWeight: 'bold', 
          textAlign: { xs: 'start', md: 'center' },
          fontSize: { xs: '1.5rem', sm: '2rem' },
          mb: 3
        }}
      >
        Welcome {promoter?.promoter_name}
      </Typography>
      
      <Divider sx={{ height:'1px',my:2 }} />

      {/* Top Cards Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 3,
          justifyContent: 'center',
          alignItems: 'stretch'
        }}
      >
        <Card
          sx={{
            backgroundColor: '#f3e5f5',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            width: { xs: '100%', sm: '300px', md: '300px' },
          }}
        >
          <CardContent sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Promoter Type
            </Typography>
            <Typography variant="h5" sx={{ color: '#7b1fa2', fontWeight: 'bold' }}>
              Premium 
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            backgroundColor: '#e8f5e9',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            minWidth: { xs: '100%', sm: '300px', md: '300px' },
          }}
        >
          <CardContent sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Promo Code
            </Typography>
            <Typography variant="h5" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
              KCPL2019
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            backgroundColor: '#e3f2fd',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            minWidth: { xs: '100%', sm: '300px', md: '300px' },
          }}
        >
          <CardContent
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Event color="primary" sx={{ mr: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Registration Dates
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                gap: 2,
                mt: 2,
              }}
            >
              <Chip
                label="Registered: 07-05-2019"
                color="primary"
                variant="outlined"
                sx={{
                  fontWeight: 'bold',
                  borderWidth: 2,
                  fontSize: '0.9rem',
                }}
              />
              <Chip
                label="Expires: Aug 18, 2019"
                color="secondary"
                variant="outlined"
                sx={{
                  fontWeight: 'bold',
                  borderWidth: 2,
                  fontSize: '0.9rem',
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Divider sx={{ height:'1px',my:2 }} />

      {/* User Cards Section */}
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          color: '#4a148c', 
          fontWeight: 'bold', 
          mb: 3,
          textAlign: 'center',
          fontSize: { xs: '1.3rem', sm: '1.5rem' }
        }}
      >
        User Statistics
      </Typography>
      
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          justifyContent: 'center',
          alignItems: 'stretch'
        }}
      >
        {sidebarData.users.map((item, index) => (
          <Card
            key={index}
            sx={{
              flex: '1 1 300px',
              maxWidth: { xs: '100%', sm: 'calc(50% - 24px)', md: 'calc(33.333% - 24px)' },
              minWidth: '280px',
              height: '140px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              borderLeft: `4px solid ${item.color}`,
              backgroundColor: '#ffffff',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
              },
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar
                  sx={{
                    backgroundColor: `${item.color}20`,
                    color: item.color,
                    mr: 2,
                    width: 50,
                    height: 50,
                  }}
                >
                  {getIconComponent(item.icon)}
                </Avatar>
                <Typography
                  variant="h5"
                  sx={{
                    color: item.color,
                    fontWeight: 'bold',
                    fontSize: '1.8rem',
                  }}
                >
                  {item.value}
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 'bold',
                  textAlign: 'start',
                  fontSize: '1.1rem'
                }}
              >
                {item.title}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </>
  );
};

export default DashboardContent;