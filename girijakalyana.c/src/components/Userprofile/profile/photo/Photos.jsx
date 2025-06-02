import React, { useRef, useState } from "react";
import { Box, Button, Typography, Card, CardMedia, DialogTitle, Dialog, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { FaTrash, FaUpload } from "react-icons/fa";
import toast from "react-hot-toast";
import useStore from "../../../../store";
import {
  getCloudinaryUrl,
  useGetMemberDetails,
  useUpdateProfile,
} from "../../../api/User/useGetProfileDetails";
import TokenService from "../../../token/tokenService";

const Photos = () => {
  const [formData, setFormData] = useState({});
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const registerNo = TokenService.getRegistrationNo();
  const { data: userProfile } = useGetMemberDetails(registerNo);
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const cloudinary = getCloudinaryUrl();
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (!file.type.match("image.*")) {
        toast.error("Please select an image file");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size should be less than 10MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({ ...prev, previewImage: e.target.result }));
      };
      reader.readAsDataURL(file);

      cloudinary.mutate(file, {
        onSuccess: (data) => {
          if (data.secure_url) {
            setFormData((prev) => ({
              ...prev,
              image: data.secure_url,
              previewImage: data.secure_url,
              image_verification: "pending" 
            }));
            toast.success("Image uploaded to Cloudinary");
          } else {
            toast.error("Failed to get image URL");
          }
        },
        onError: (err) => {
          toast.error("Failed to upload image");
          console.error(err);
        },
      });
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleSave = () => {
    if (!formData.image) {
      toast.error("Please upload an image first");
      return;
    }

    updateProfile(
      {
        registerNo,
        image: formData.image,
        image_verification: "pending"
      },
      {
        onSuccess: () => {
          toast.success("Profile image updated successfully");
        },
        onError: (error) => {
          toast.error(
            error.response?.data?.message || "Failed to update profile"
          );
        },
      }
    );
  };

   const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

   const handleDeleteConfirm = () => {
    updateProfile(
      {
        registerNo,
        image: null,
        image_verification: null
      },
      {
        onSuccess: () => {
          toast.success("Profile image deleted successfully");
          setFormData(prev => ({ ...prev, previewImage: null, image: null }));
          setOpenDeleteDialog(false);
        },
        onError: (error) => {
          toast.error(
            error.response?.data?.message || "Failed to delete profile image"
          );
          setOpenDeleteDialog(false);
        },
      }
    );
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
  };

  return (
    <Box
      sx={{
        padding: "24px",
        backgroundColor: "#f9f9f9",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        fontFamily: "Roboto, sans-serif",
        maxWidth: "600px",
        margin: "auto",
        display: "flex",
      }}
    >
      <Card
        sx={{
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "12px",
          padding: "16px",
          width: "100%",
        }}
      >
        <Box>
          <Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {formData.previewImage || userProfile?.image ? (
                <CardMedia
                  src={formData.previewImage || userProfile?.image}
                  component="img"
                  height="450"
                  alt="Uploaded Preview"
                  sx={{
                    borderRadius: "12px",
                    marginBottom: "16px",
                    width: "100%",
                    objectFit: "cover",
                    overflowY: "auto",
                    maxHeight: "450px",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    height: "200px",
                    width: "100%",
                    backgroundColor: "#e0e0e0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "12px",
                    marginBottom: "16px",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No Image Selected
                  </Typography>
                </Box>
              )}
            </Box>

            <Typography
              variant="body2"
              color="text.primary"
              sx={{ marginBottom: "16px", textAlign: "center" }}
            >
              * Please upload high-resolution images only (Max size: 10 MB)
            </Typography>
          </Box>
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              startIcon={<FaUpload />}
              onClick={handleUploadClick}
              sx={{
                color: "#1976d2",
                borderColor: "#1976d2",
                "&:hover": {
                  backgroundColor: "#f0f7ff",
                },
              }}
            >
              Choose File
              <input
                type="file"
                name="image"
                accept="image/*"
                hidden
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </Button>

            <Button
              variant="contained"
              size="small"
              onClick={handleSave}
              disabled={isUpdating || !formData.image}
              sx={{
                height: "35px",
                backgroundColor: "#34495e",
                "&:hover": {
                  backgroundColor: "#1976d2",
                },
                visibility: formData.image ? "visible" : "visible", // Always visible
                opacity: !formData.image || isUpdating ? 0.7 : 1, // Faded when disabled
              }}
            >
              {isUpdating ? "Saving..." : "Save"}
            </Button>
              {(userProfile?.image || formData.image) && (
              <Button
                variant="contained"
                color="error"
                size="small"
                startIcon={<FaTrash />}
                onClick={handleDeleteClick}
                disabled={isUpdating}
                sx={{
                  height: "35px",
                  "&:hover": {
                    backgroundColor: "#d32f2f",
                  },
                }}
              >
                Delete
              </Button>
            )}
          </Box>
          <Box sx={{mt:2}}>
            <Typography sx={{ fontWeight: "bold" }}>
              Image Verification Status:{" "}
              <Box
                component="span"
                sx={{
                  color:
                    {
                      active: "green",
                      pending: "orange",
                    }[userProfile?.image_verification] || "text.secondary",
                }}
              >
                {!userProfile?.image ? "Please Upload Image" : userProfile?.image_verification}
              </Box>
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Profile Image?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete your profile image? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Photos;
