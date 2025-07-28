import React from "react";
import DataTable from "react-data-table-component";
import { Typography, Paper } from "@mui/material";


const PaginationDataTable = ({
  columns,
  data,
  customStyles,
  isLoading,
  totalRows,
  paginationModel,
  setPaginationModel,
  rowsPerPageOptions = [6, 10, 15, 20, 50],
  noDataComponent = <Typography padding={3}>No data available</Typography>,
  progressComponent = null,
  ...rest
}) => {
  // Handle page and pageSize changes internally
  const handlePageChange = (page) => {
    setPaginationModel((prev) => ({ ...prev, page: page - 1 }));
  };
  const handleRowsPerPageChange = (pageSize) => {
    setPaginationModel((prev) => ({ ...prev, pageSize, page: 0 }));
  };
  return (
    <Paper sx={{ mt: 2 }}>
      <DataTable
        columns={columns}
        data={data}
        customStyles={customStyles}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        paginationDefaultPage={paginationModel.page + 1}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleRowsPerPageChange}
        paginationPerPage={paginationModel.pageSize}
        paginationRowsPerPageOptions={rowsPerPageOptions}
        paginationComponentOptions={{
          rowsPerPageText: "Rows per page:",
          rangeSeparatorText: "of",
          noRowsPerPage: false,
        }}
        noDataComponent={noDataComponent}
        progressPending={isLoading}
        progressComponent={progressComponent}
        persistTableHead
        highlightOnHover
        {...rest}
      />
    </Paper>
  );
};

export default PaginationDataTable;
