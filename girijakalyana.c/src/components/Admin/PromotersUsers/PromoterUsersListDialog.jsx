import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, IconButton } from '@mui/material'
import DataTable from 'react-data-table-component'
import { customStyles, getPromoterUserListTable } from '../../../utils/DataTableColumnsProvider'
import { LoadingTextSpinner } from '../../../utils/common'
import { Close } from '@mui/icons-material'

const PromoterUsersListDialog = ({ open, promoterId, onClose, PromoterUsers, isFetching }) => {
    return (
        <Dialog open={open} fullWidth maxWidth="lg" sx={{}}>
            <DialogTitle
                sx={{ m: 0, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
                <div>Users for Promoter - <strong>{promoterId}</strong></div>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        color: (theme) => theme.palette.grey[900],
                    }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <DataTable
                    columns={getPromoterUserListTable()}
                    data={PromoterUsers || []}
                    customStyles={customStyles}
                    pagination
                    paginationPerPage={20}
                    paginationRowsPerPageOptions={[20, 40, 50, 100]}
                    paginationComponentOptions={{
                        rowsPerPageText: "Rows per page:",
                        rangeSeparatorText: "of",
                    }}
                    progressPending={isFetching}
                    progressComponent={<LoadingTextSpinner />}
                    noDataComponent={
                        <Typography padding={3} textAlign="center">
                            No Users found
                        </Typography>
                    }
                />
            </DialogContent>
        </Dialog>
    )
}

export default PromoterUsersListDialog