import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  TablePagination,
  useTheme,
  useMediaQuery
} from '@mui/material';

const TransactionDetailsDialog = ({ open, onClose, transactions, promoterCode }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  React.useEffect(() => {
    setPage(0);
  }, [open, transactions]);

  const paginatedTransactions = useMemo(() => {
    if (!transactions?.length) return [];
    return transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [transactions, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth sx={{ '& .MuiDialog-paper': { minHeight: '600px' } }}>
      <DialogTitle>
        <Box>
          <Typography variant="h6" component="div">
            Transaction Details - {promoterCode}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Total Transactions: {transactions?.length || 0}
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <TableContainer component={Paper} sx={{ flex: 1 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Ref No</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Mobile</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Transaction No</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Transaction Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>User Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((transaction, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{transaction.ref_no || "N/A"}</TableCell>
                    <TableCell>{transaction.emailid || "N/A"}</TableCell>
                    <TableCell>{transaction.mobile || "N/A"}</TableCell>
                    <TableCell>₹{transaction.amount_earned || "0"}</TableCell>
                    <TableCell>{transaction.transaction_no || "N/A"}</TableCell>
                    <TableCell>{transaction.transaction_date || "N/A"}</TableCell>
                    <TableCell>{transaction.usertype || "N/A"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="textSecondary" sx={{ py: 2 }}>
                      No transactions found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {transactions?.length > 0 && (
          <TablePagination
            rowsPerPageOptions={isMobile ? [5, 10] : [5, 10, 25, 50]}
            component="div"
            count={transactions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              color: '#000',
              '& .MuiTablePagination-selectLabel': { 
                color: '#000',
              },
              '& .MuiTablePagination-select': { 
                color: '#000',
                marginRight: isMobile ? 1 : 2
              },
              '& .MuiTablePagination-displayedRows': { 
                color: '#000',
                margin: 0,
                fontSize: isMobile ? '12px' : '14px'
              }
            }}
            labelRowsPerPage={isMobile ?   "Rows:":"rows per page :"}
            labelDisplayedRows={({ from, to, count }) => 
              isMobile ? `${from}-${to}/${count}` : `${from}-${to} of ${count}`
            }
          />
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionDetailsDialog;