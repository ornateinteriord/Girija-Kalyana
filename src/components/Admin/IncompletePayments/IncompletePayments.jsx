import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Pagination,
  ImageList,
  ImageListItem,
  ImageListItemBar
} from '@mui/material';
import {
  InfoOutlined,
  CheckCircleOutline,
  PhotoLibrary
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { get, post } from '../../api/authHooks';
import { useAdminIncompletePayments, useResolveIncompletePayment } from '../../api/Admin';

const IncompletePayments = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showResolved, setShowResolved] = useState(false);
  const [showTickets, setShowTickets] = useState(false);
  const [incompletePayments, setIncompletePayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [transactionDetails, setTransactionDetails] = useState({
    registrationNo: '',
    paymentId: '',
    bankRefNum: '',
    mode: 'UPI',
    amount: '',
    promocode: '',
    discountApplied: 0,
    originalAmount: '',
    userType: 'paidSilver'
  });

  // Use the new admin API hooks
  const { data: paymentsData, isLoading, refetch } = useAdminIncompletePayments({
    page,
    limit: 10,
    resolved: showResolved,
    ticketRaised: showTickets
  });

  const { mutate: resolvePayment } = useResolveIncompletePayment();

  // Update state when data changes
  useEffect(() => {
    if (paymentsData) {
      setIncompletePayments(paymentsData.data || []);
      setTotalPages(paymentsData.totalPages || 1);
    }
  }, [paymentsData]);

  // Set loading state based on query status
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  const handleResolveSubmit = () => {
    resolvePayment(
      { orderId: selectedPayment.orderId, data: { resolutionNotes, transactionDetails } },
      {
        onSuccess: () => {
          toast.success('Payment resolved successfully');
          setResolveDialogOpen(false);
          // The refetch will automatically update the data
        },
        onError: (error) => {
          console.error('Error resolving payment:', error);
          toast.error('Failed to resolve payment');
        }
      }
    );
  };

  const handleResolvePayment = (payment) => {
    setSelectedPayment(payment);
    setTransactionDetails({
      registrationNo: payment.customerDetails?.customerId || '',
      paymentId: payment.transactionId || '',
      bankRefNum: '',
      mode: 'UPI',
      amount: payment.amount || '',
      promocode: '',
      discountApplied: 0,
      originalAmount: payment.amount || '',
      userType: 'paidSilver'
    });
    setResolutionNotes('');
    setResolveDialogOpen(true);
  };

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setResolveDialogOpen(true);
  };

  const handleViewImages = (images) => {
    setSelectedImages(images);
    setImageDialogOpen(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Pagination handler
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Incomplete Payments</Typography>
        <Box>
          <Button
            variant={!showResolved && !showTickets ? "contained" : "outlined"}
            onClick={() => {
              setShowResolved(false);
              setShowTickets(false);
              setPage(1); // Reset to first page
            }}
            sx={{ mr: 2 }}
          >
            All
          </Button>
          <Button
            variant={showResolved ? "contained" : "outlined"}
            onClick={() => {
              setShowResolved(true);
              setShowTickets(false);
              setPage(1); // Reset to first page
            }}
            sx={{ mr: 2 }}
          >
            Resolved
          </Button>
          <Button
            variant={showTickets ? "contained" : "outlined"}
            onClick={() => {
              setShowResolved(false);
              setShowTickets(true);
              setPage(1); // Reset to first page
            }}
          >
            With Tickets
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Order Status</TableCell>
                  <TableCell>Payment Status</TableCell>
                  <TableCell>Ticket</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {incompletePayments.map((payment) => (
                  <TableRow key={payment._id}>
                    <TableCell>{payment.orderId}</TableCell>
                    <TableCell>
                      <Typography variant="body2">{payment.customerDetails?.customerName}</Typography>
                      <Typography variant="caption">{payment.customerDetails?.customerPhone}</Typography>
                    </TableCell>
                    <TableCell>₹{payment.amount}</TableCell>
                    <TableCell>
                      <Chip 
                        label={payment.orderStatusFromGateway} 
                        color={payment.orderStatusFromGateway === 'PAID' ? 'success' : 'default'} 
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={payment.paymentStatusFromGateway} 
                        color={payment.paymentStatusFromGateway === 'SUCCESS' ? 'success' : 'error'} 
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {payment.ticketRaised ? (
                        <Chip 
                          label="Yes" 
                          color="primary" 
                          size="small"
                          onClick={() => handleViewDetails(payment)}
                          sx={{ cursor: 'pointer' }}
                        />
                      ) : (
                        <Chip 
                          label="No" 
                          color="default" 
                          size="small"
                        />
                      )}
                    </TableCell>
                    <TableCell>{formatDate(payment.createdAt)}</TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton onClick={() => handleViewDetails(payment)}>
                          <InfoOutlined />
                        </IconButton>
                      </Tooltip>
                      {!payment.resolved && (
                        <Tooltip title="Resolve Payment">
                          <IconButton onClick={() => handleResolvePayment(payment)}>
                            <CheckCircleOutline />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {incompletePayments.length === 0 && (
            <Box sx={{ textAlign: 'center', my: 4 }}>
              <Typography>No incomplete payments found</Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination 
              count={totalPages} 
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      )}

      {/* Resolve Payment Dialog */}
      <Dialog open={resolveDialogOpen} onClose={() => setResolveDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Resolve Payment</DialogTitle>
        <DialogContent>
          {selectedPayment && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Order ID: {selectedPayment.orderId}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Customer: {selectedPayment.customerDetails?.customerName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Amount: ₹{selectedPayment.amount}
              </Typography>
              
              <TextField
                label="Resolution Notes"
                multiline
                rows={3}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                fullWidth
                margin="normal"
              />
              
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Transaction Details
              </Typography>
              
              <TextField
                label="Registration No"
                value={transactionDetails.registrationNo}
                onChange={(e) => setTransactionDetails({...transactionDetails, registrationNo: e.target.value})}
                fullWidth
                margin="normal"
              />
              
              <TextField
                label="Payment ID"
                value={transactionDetails.paymentId}
                onChange={(e) => setTransactionDetails({...transactionDetails, paymentId: e.target.value})}
                fullWidth
                margin="normal"
              />
              
              <TextField
                label="Bank Reference Number"
                value={transactionDetails.bankRefNum}
                onChange={(e) => setTransactionDetails({...transactionDetails, bankRefNum: e.target.value})}
                fullWidth
                margin="normal"
              />
              
              <FormControl fullWidth margin="normal">
                <InputLabel>Mode</InputLabel>
                <Select
                  value={transactionDetails.mode}
                  onChange={(e) => setTransactionDetails({...transactionDetails, mode: e.target.value})}
                  label="Mode"
                >
                  <MenuItem value="UPI">UPI</MenuItem>
                  <MenuItem value="Net Banking">Net Banking</MenuItem>
                  <MenuItem value="Credit Card">Credit Card</MenuItem>
                  <MenuItem value="Debit Card">Debit Card</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                label="Amount"
                type="number"
                value={transactionDetails.amount}
                onChange={(e) => setTransactionDetails({...transactionDetails, amount: e.target.value})}
                fullWidth
                margin="normal"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResolveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleResolveSubmit} variant="contained" color="primary">
            Resolve Payment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Gallery Dialog */}
      <Dialog open={imageDialogOpen} onClose={() => setImageDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Payment Images</DialogTitle>
        <DialogContent>
          <ImageList cols={3} rowHeight={164}>
            {selectedImages.map((imageUrl, index) => (
              <ImageListItem key={index}>
                <img
                  src={imageUrl}
                  alt={`Payment image ${index}`}
                  loading="lazy"
                />
                <ImageListItemBar
                  title={`Image ${index + 1}`}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IncompletePayments;