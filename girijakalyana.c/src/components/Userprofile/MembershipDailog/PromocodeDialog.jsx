import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { AiOutlineClose } from "react-icons/ai";
import { useCheckPromocode } from "../../api/Payment";

const PromocodeDialog = ({ open, onClose, onPromocodeApply }) => {
  const [promocode, setPromocode] = useState("");
  const [isApplied, setIsApplied] = useState(false);
  
  const checkPromocodeMutation = useCheckPromocode();

  const handleApplyPromocode = () => {
    if (!promocode.trim()) {
      return;
    }

    checkPromocodeMutation.mutate(
      { promocode: promocode.trim() },
      {
        onSuccess: (response) => {
          setIsApplied(true);
          if (onPromocodeApply) {
            onPromocodeApply({
              promocode: promocode.trim(),
              discount: 100, // ₹100 discount
              isValid: true
            });
          }
          // Auto close after 1.5 seconds to show success message
          setTimeout(() => {
            onClose();
            setPromocode("");
            setIsApplied(false);
          }, 1500);
        },
        onError: () => {
          setIsApplied(false);
        }
      }
    );
  };

  const handleClose = () => {
    onClose();
    setPromocode("");
    setIsApplied(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          fontSize: "1.5rem",
          fontWeight: 700,
          textAlign: "center",
          p: 3,
        }}
      >
        Apply Promocode
        <IconButton
          sx={{
            position: "absolute",
            right: 15,
            top: 15,
          }}
          onClick={handleClose}
        >
          <AiOutlineClose size={24} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="body1" color="text.secondary">
            Enter your promocode to get ₹100 discount on your membership plan.
          </Typography>
          
          <TextField
            fullWidth
            label="Promocode"
            variant="outlined"
            value={promocode}
            onChange={(e) => setPromocode(e.target.value.toUpperCase())}
            placeholder="Enter promocode"
            disabled={checkPromocodeMutation.isPending || isApplied}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: isApplied ? "#4caf50" : undefined,
                },
              },
            }}
          />

          {isApplied && (
            <Box
              sx={{
                p: 2,
                backgroundColor: "#e8f5e8",
                borderRadius: 2,
                textAlign: "center",
                border: "1px solid #4caf50",
              }}
            >
              <Typography variant="h6" color="success.main" fontWeight={700} sx={{ mb: 1 }}>
                ✓ Success!
              </Typography>
              <Typography variant="body2" color="success.main" fontWeight={600}>
                Promocode applied successfully! You saved ₹100
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", p: 3, gap: 2 }}>
        <Button
          variant="outlined"
          onClick={handleClose}
          disabled={checkPromocodeMutation.isPending}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleApplyPromocode}
          disabled={!promocode.trim() || checkPromocodeMutation.isPending || isApplied}
          startIcon={
            checkPromocodeMutation.isPending ? (
              <CircularProgress size={20} />
            ) : null
          }
          sx={{
            minWidth: 120,
            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
            "&:hover": {
              background: "linear-gradient(45deg, #1976D2 30%, #0288D1 90%)",
            },
          }}
        >
          {checkPromocodeMutation.isPending ? "Checking..." : "Apply"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PromocodeDialog;