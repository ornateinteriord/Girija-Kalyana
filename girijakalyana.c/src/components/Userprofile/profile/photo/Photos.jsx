import { useRef, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardMedia,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { FaTrash, FaUpload } from "react-icons/fa";
import toast from "react-hot-toast";
import {
  useDeleteImage,
  useGetMemberDetails,
  useImageKitUpload,
  useUpdateProfile,
} from "../../../api/User/useGetProfileDetails";
import TokenService from "../../../token/tokenService";
import { LoadingComponent } from "../../../../App";

const Photos = () => {
  const [formData, setFormData] = useState({});
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const registerNo = TokenService.getRegistrationNo();
  const { data: userProfile, refetch : getMember } = useGetMemberDetails(registerNo);
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const imagekit = useImageKitUpload(userProfile?.registration_no)

  const handleFileChange = async (event) => {
    const input = event.target;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
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

      imagekit.mutate(file, {
        onSuccess: (data) => {
          if (data.url) {
            setFormData((prev) => ({
              ...prev,
              image: data.url,
              previewImage: data.url,
              image_verification: "pending",
            }));
            toast.success("Image uploaded to Successfully");
          } else {
            toast.error("Failed to get image URL");
          }
        },
        onError: (err) => {
          toast.error("Failed to upload image");
          console.error(err);
        },
      });
      input.value = null;
    }
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
        image_verification: "pending",
      },
      {
        onSuccess: () => {
          toast.success("Profile image updated successfully");
          getMember()
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
  const DeleteImage = useDeleteImage();
  const handleDeleteConfirm = () => {
    DeleteImage.mutate(
      { regNo: registerNo },
      {
        onSuccess: (response) => {
          toast.success(response.message);
          setFormData((prev) => ({ ...prev, previewImage: null, image: null }));
          getMember();
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
        padding: {xs:'0px',md:'24px'},
        borderRadius: "12px",
        maxWidth: "600px",
        margin: "auto",
        display: "flex",
         mt:{xs:1},
      }}
    >
      <Card
        sx={{
          // boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "12px",
          padding:{xs:"10px",md:"16px"},
          width: "100%",
        }}
      >
        <Box>
          <Box sx={{p:{xs:0,md:2}}}>
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
              sx={{ marginBottom:{xs:'7px',md:'16px'}, textAlign: "center" }}
            >
              * Please upload high-resolution images only (Max size: 10 MB)
            </Typography>
          </Box>
          <Box sx={{ mb: 2 ,}}>
            <Typography sx={{ fontWeight: "400px", color: "#000",textAlign: {xs:'center',md:'center'},
          fontSize: { xs: '15px', sm: '18px' } }}>
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
                {!userProfile?.image
                  ? "Please Upload Image"
                  : userProfile?.image_verification}
              </Box>
            </Typography>
          </Box>
          <Box
  display="flex"
  flexDirection="column"
  gap={1}
  sx={{
    width: "100%",
  }}
>
  {/* File Upload Button - Full Width */}
  <Button
    variant="outlined"
    component="label"
    startIcon={<FaUpload />}
    sx={{
      width: "100%",
      maxWidth: "100%",
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
      onChange={handleFileChange}
      onClick={(e) => (e.target.value = null)}
    />
  </Button>

  {/* Save and Delete Buttons - Side by Side */}
  <Box
    display="flex"
    gap={1}
    sx={{
      width:{xs:"100%",md:`${userProfile?.image ? "50%" : "100%"}`},
    }}
  >
    <Button
      variant="contained"
      size="small"

      onClick={handleSave}
      disabled={isUpdating || !formData.image || imagekit.isPending}
      sx={{
        flex: 1, 
        height: "40px",
        margin: `${userProfile?.image ? undefined : 'auto'}`,
        backgroundColor: "#34495e",
        "&:hover": {
          backgroundColor: "#1976d2",
        },
        opacity: isUpdating ? 0.7 : 1,
        cursor: isUpdating ? "not-allowed" : "pointer",
      }}
    >
      {isUpdating ? "Saving..." : "Save"}
    </Button>
    
    {userProfile?.image && (
      <Button
        variant="contained"
        color="error"
        size="small"
        startIcon={<FaTrash />}
        onClick={handleDeleteClick}
        disabled={isUpdating}
        sx={{
          flex: 1, // Take equal space
          height: "40px",
          "&:hover": {
            backgroundColor: "#d32f2f",
          },
        }}
      >
        Delete
      </Button>
    )}
  </Box>
</Box>
        </Box>
      </Card>

      {imagekit.isPending && <LoadingComponent />}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Profile Image?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete your profile image? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
      <DialogActions>
  <Button
    onClick={handleDeleteCancel}
    color="primary"
    sx={{
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 255, 0.04)',
      },
    }}
  >
    Cancel
  </Button>

  <Button
    onClick={handleDeleteConfirm}
    color="error"
    autoFocus
    disabled={DeleteImage.isPending}
    sx={{
      '&:hover': {
        backgroundColor: 'rgba(255, 0, 0, 0.08)', 
      },
    }}
  >
    {DeleteImage.isPending ? 'Deleting...' : 'Delete'}
  </Button>
</DialogActions>

      </Dialog>
    </Box>
  );
};

export default Photos;
