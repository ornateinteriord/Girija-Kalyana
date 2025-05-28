import  { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Select,
  MenuItem,
  Modal,
  InputAdornment,
  FormControl,
  FormHelperText,
} from "@mui/material";

import { FaSearch } from "react-icons/fa";
import DataTable from "react-data-table-component";
import {
  customStyles,
  getNotificationDataColumns,
} from "../../../utils/DataTableColumnsProvider";
import {  TableLoadingComponent } from "../../../App";
import { getAllNews, useAddNews } from "../../api/Admin";
import { toast } from "react-toastify";

const NotificationData = () => {
  const { data: records = [], isLoading, isError, error } = getAllNews();
  const [search, setSearch] = useState("");
  const [showAddNews, setShowAddNews] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({
    news_details: false,
    from_date: false,
    to_date: false,
    news_type: false,
  });

  const addNewsMutation = useAddNews();

  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError, error]);

  const filterCurrentRowData = records.filter(
    (data) =>
      search === null ||
      data.news_id?.toString().includes(search.toString()) ||
      data.news_details?.toLowerCase().includes(search.toLowerCase()) ||
      data.from_date.toLowerCase().includes(search.toLowerCase()) ||
      data.to_date.toLowerCase().includes(search.toLowerCase()) ||
      data.news_type.toLowerCase().includes(search.toLowerCase()) ||
      data.status.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleClosePopup = () => setShowAddNews(false);
  const handleShowPopup = () => setShowAddNews(true);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const newErrors = {
      news_details: !formData.news_details,
      from_date: !formData.from_date,
      to_date: !formData.to_date,
      news_type: !formData.news_type,
    };

    setErrors(newErrors);
    if (Object.values(newErrors).some((error) => error)) {
      toast.error("Please fill all required fields");
      return;
    }
    if (new Date(formData.to_date) < new Date(formData.from_date)) {
      toast.error("To Date must be after From Date");
      return;
    }
    addNewsMutation.mutate(formData, {
      onSuccess: () => {
        handleClosePopup();
        setFormData({
          news_details: "",
          from_date: "",
          to_date: "",
          news_type: "",
          status: "active",
        });
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    });
  };

  return (
    <Box
      sx={{
        fontFamily: "Outfit, sans-serif",
        p: 3,
        marginTop: "70px",
      }}
    >
      <Typography
        variant="h4"
        color="#34495e"
        fontFamily={"Outfit sans-serif"}
        sx={{ textAlign: { xs: "center", sm: "left" }, mb: "20px" }}
      >
        Notification Data
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          mb: "20px",
        }}
      >
        <TextField
          label="search"
          variant="outlined"
          placeholder="Search"
          value={search}
          onChange={handleSearchChange}
          sx={{ width: { xs: "100%", sm: "auto", md: "auto" }, mb: "20px" }}
          InputProps={{
            startAdornment: (
              <InputAdornment>
                <FaSearch />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          onClick={handleShowPopup}
          style={{
            width: "100px",
            height: "50px",
            background: "#34495e",
            color: "#fff",
          }}
        >
          Add
        </Button>
      </Box>

      <DataTable
        columns={getNotificationDataColumns()}
        data={filterCurrentRowData}
        pagination
        paginationPerPage={6}
        paginationRowsPerPageOptions={[6, 10, 15, 20]}
        paginationComponentOptions={{
          rowsPerPageText: "Rows per page:",
          rangeSeparatorText: "of",
        }}
        noDataComponent={
          <Typography padding={3} textAlign="center">
            No records found
          </Typography>
        }
        customStyles={customStyles}
        progressPending={isLoading}
        progressComponent={<TableLoadingComponent />}
        persistTableHead
        highlightOnHover
      />

      <Modal open={showAddNews} onClose={handleClosePopup}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
            width: 400,
          }}
        >
          <Typography variant="h6" mb={2}>
            Add News
          </Typography>
          <Box mb={2}>
            <TextField
              label="Description"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              name="news_details"
              value={formData.news_details}
              onChange={handleInputChange}
              error={errors.news_details}
              helperText={errors.news_details ? "This field is required" : ""}
            />
          </Box>
          <Box display="flex" gap={2} mb={2}>
            <TextField
              label="From Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              name="from_date"
              value={formData.from_date}
              onChange={handleInputChange}
              error={errors.from_date}
              helperText={errors.from_date ? "This field is required" : ""}
            />
            <TextField
              label="To Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              name="to_date"
              value={formData.to_date}
              onChange={handleInputChange}
              error={errors.to_date}
              helperText={errors.to_date ? "This field is required" : ""}
            />
          </Box>
          <Box mb={2}>
            <FormControl fullWidth error={errors.news_type}>
              <Select
                labelId="news-type-label"
                name="news_type"
                value={formData.news_type}
                onChange={handleInputChange}
                displayEmpty
                renderValue={(selected) =>
                  selected || (
                    <span style={{ opacity: 0.7 }}>Select News Type</span>
                  )
                }
              >
                <MenuItem value="" disabled>
                  Select News Type
                </MenuItem>
                <MenuItem value="Premium">Premium</MenuItem>
                <MenuItem value="Free">Free</MenuItem>
                <MenuItem value="Promoter">Promoter</MenuItem>
              </Select>
              {errors.news_type && (
                <FormHelperText>Please select a news type</FormHelperText>
              )}
            </FormControl>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleClosePopup}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default NotificationData;
