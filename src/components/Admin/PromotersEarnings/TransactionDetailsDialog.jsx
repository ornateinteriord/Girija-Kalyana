import React, { useState, useMemo,useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Box, TablePagination,
  useTheme, useMediaQuery,
  CircularProgress
} from '@mui/material';
import { useAllPromotersData } from '../../api/Admin';
import { getTransactionDetailsDialogColumns } from '../../../utils/DataTableColumnsProvider';
import DataTable from 'react-data-table-component';
import { LoadingTextSpinner } from '../../../utils/common';

const TransactionDetailsDialog = ({ open, onClose, promoterCode }) => {
  const { data: allRecords = [], isLoading } = useAllPromotersData(promoterCode, open);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const transactions = useMemo(() => {
    return allRecords.filter(
      (record) => record.referal_by === promoterCode
    );
  }, [allRecords, promoterCode]);

  const columns = useMemo(() => getTransactionDetailsDialogColumns(), []);

  useEffect(() => {
    setPage(0);
  }, [open, promoterCode]);

  const paginatedTransactions = useMemo(() => {
    if (!transactions?.length) return [];
    return transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [transactions, page, rowsPerPage]);

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth sx={{ '& .MuiDialog-paper': { minHeight: '600px' } }}>
      <DialogTitle>
        <Box>
          <Typography variant="h6">Transaction Details - {promoterCode}</Typography>
          <Typography variant="body2" color="textSecondary">
            Total Transactions: {transactions?.length || 0}
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <DataTable
            columns={columns}
            data={paginatedTransactions}
            noDataComponent={
              <Typography variant="body2" color="textSecondary" sx={{ py: 2, textAlign: 'center' }}>
                No transactions found
              </Typography>
            }
            progressComponent={<LoadingTextSpinner/>}
            progressPending={isLoading}
            highlightOnHover
          />

        {transactions?.length > 0 && (
          <TablePagination
            rowsPerPageOptions={isMobile ? [5, 10] : [5, 7, 15, 25]}
            component="div"
            count={transactions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              color: '#000',
              '& .MuiTablePagination-selectLabel': { color: '#000' },
              '& .MuiTablePagination-select': { color: '#000', marginRight: isMobile ? 1 : 2 },
              '& .MuiTablePagination-displayedRows': { color: '#000', fontSize: isMobile ? '12px' : '14px' }
            }}
            labelRowsPerPage={isMobile ? "Rows:" : "rows per page :"}
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
