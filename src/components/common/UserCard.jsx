import React from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Typography,
} from "@mui/material";
import { FaBriefcase, FaMapMarkerAlt } from "react-icons/fa";
import { calculateAge, isSilverOrPremiumUser } from "../../utils/common";

const UserCard = ({
  profile,
  connection = null,
  onViewMore = () => { },
  onCancelRequest = () => { },
  onRemoveConnection = () => { },
  interestId = null,
  showCancelButton = false,
  onResponse = () => { },
  showResponseButtons = false,
  showRemoveButton = false,
}) => {
  const age = profile?.age || calculateAge(profile?.date_of_birth);
  const isPremium = isSilverOrPremiumUser(profile?.type_of_user || profile?.type_of_use);

  return (
    <Card
      sx={{
        width: { xs: 280, sm: 280, md: 260, lg: 280 },
        borderRadius: "20px",
        boxShadow: "0 4px 24px rgba(26,79,114,0.10)",
        overflow: "hidden",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 12px 36px rgba(26,79,114,0.18)",
        },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        background: "#fff",
      }}
    >
      {/* Top gradient banner */}
      <Box
        sx={{
          width: "100%",
          height: 72,
          background: "linear-gradient(135deg, #1a4f72 0%, #2196f3 100%)",
          position: "relative",
          flexShrink: 0,
        }}
      />

      {/* Connection direction badge */}
      {connection && (
        <Box
          sx={{
            position: "absolute",
            top: 10,
            right: 12,
            backgroundColor:
              connection?.direction === "sent" ? "#1976d2" : "#4caf50",
            color: "white",
            borderRadius: "50%",
            width: 26,
            height: 26,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "13px",
            fontWeight: "bold",
            border: "2px solid white",
            zIndex: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
          title={
            connection?.direction === "sent"
              ? "You sent this request"
              : "You accepted this request"
          }
        >
          {connection?.direction === "sent" ? "↑" : "↓"}
        </Box>
      )}

      {/* Premium badge */}
      {isPremium && (
        <Chip
          label="★ PREMIUM"
          size="small"
          sx={{
            position: "absolute",
            top: 10,
            left: connection ? 12 : "auto",
            right: connection ? "auto" : 12,
            fontWeight: 700,
            fontSize: "0.6rem",
            letterSpacing: "0.5px",
            background: "linear-gradient(135deg, #f7c948, #e6a800)",
            color: "#5a3800",
            border: "none",
            boxShadow: "0 2px 8px rgba(230,168,0,0.4)",
            zIndex: 2,
            height: 22,
          }}
        />
      )}

      {/* Avatar floated over banner */}
      <Box
        sx={{
          position: "relative",
          mt: "-44px",
          mb: 1.5,
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            width: { xs: 90, sm: 96 },
            height: { xs: 90, sm: 96 },
            borderRadius: "50%",
            background: "linear-gradient(135deg, #1a4f72, #64b5f6)",
            padding: "3px",
            boxShadow: "0 4px 16px rgba(26,79,114,0.35)",
          }}
        >
          <Avatar
            src={profile?.image}
            alt={profile?.first_name}
            sx={{
              width: "100%",
              height: "100%",
              border: "3px solid #fff",
              fontSize: "2rem",
            }}
          />
        </Box>
      </Box>

      <CardContent
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: { xs: 1.5, sm: 2 },
          pt: 0,
          pb: "16px !important",
          textAlign: "center",
        }}
      >
        {/* Name */}
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "1rem",
            color: "#1a1a1a",
            mb: 0.25,
            lineHeight: 1.3,
          }}
        >
          {profile?.first_name} {profile?.last_name}
        </Typography>

        {/* Age pill */}
        <Typography
          sx={{
            fontSize: "0.82rem",
            color: "#1a4f72",
            fontWeight: 600,
            mb: 1.2,
            background: "rgba(26,79,114,0.08)",
            px: 1.5,
            py: 0.25,
            borderRadius: "20px",
          }}
        >
          {age || "N/A"} yrs
        </Typography>

        {/* Occupation */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.75,
            mb: 0.6,
          }}
        >
          <FaBriefcase size={13} color="#1a4f72" />
          <Typography variant="body2" sx={{ color: "#444", fontSize: "0.82rem" }}>
            {profile?.occupation || "Not specified"}
          </Typography>
        </Box>

        {/* Location */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.75,
            mb: 1.5,
          }}
        >
          <FaMapMarkerAlt size={13} color="#1a4f72" />
          <Typography variant="body2" sx={{ color: "#444", fontSize: "0.82rem" }}>
            {[profile?.city, profile?.state, profile?.country]
              .filter(Boolean)
              .join(", ") || "Location not specified"}
          </Typography>
        </Box>

        {/* Stats row */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-around",
            background: "rgba(26,79,114,0.05)",
            borderRadius: "12px",
            py: 1,
            px: 0.5,
            mb: 1.5,
          }}
        >
          <ProfileInfo label="Height" value={profile?.height || "N/A"} />
          <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(26,79,114,0.15)" }} />
          <ProfileInfo label="Religion" value={profile?.religion || "N/A"} />
          <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(26,79,114,0.15)" }} />
          <ProfileInfo label="Caste" value={profile?.caste || "N/A"} />
        </Box>

        {/* Action Buttons */}
        <Box
          display="flex"
          justifyContent="center"
          gap={1}
          width="100%"
          mt="auto"
          flexWrap="wrap"
        >
          {showResponseButtons && (
            <Box sx={{ display: "flex", gap: 1, width: "100%", mb: 0.75 }}>
              <Button
                fullWidth
                variant="outlined"
                sx={{
                  color: "#d32f2f",
                  borderColor: "rgba(211,47,47,0.4)",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: "10px",
                  fontSize: "0.82rem",
                  flex: 1,
                  "&:hover": {
                    background: "rgba(211,47,47,0.06)",
                    borderColor: "#d32f2f",
                  },
                }}
                onClick={() => onResponse(profile?.registration_no, false)}
              >
                Reject
              </Button>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  background: "linear-gradient(135deg, #1a4f72, #2196f3)",
                  color: "#fff",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: "10px",
                  fontSize: "0.82rem",
                  flex: 1,
                  boxShadow: "0 2px 10px rgba(26,79,114,0.3)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #2196f3, #1a4f72)",
                    boxShadow: "0 4px 14px rgba(26,79,114,0.4)",
                  },
                }}
                onClick={() => onResponse(profile?.registration_no, true)}
              >
                Accept
              </Button>
            </Box>
          )}

          {/* View More */}
          <Button
            fullWidth
            variant="contained"
            onClick={() => onViewMore(profile)}
            sx={{
              background: "linear-gradient(135deg, #1a4f72 0%, #2196f3 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #2196f3 0%, #1a4f72 100%)",
                boxShadow: "0 4px 16px rgba(26,79,114,0.4)",
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s ease",
              boxShadow: "0 2px 10px rgba(26,79,114,0.25)",
              borderRadius: "10px",
              py: 0.9,
              textTransform: "none",
              fontWeight: 600,
              fontSize: { xs: "0.82rem", sm: "0.88rem" },
            }}
          >
            View Profile
          </Button>

          {showRemoveButton && (
            <Button
              fullWidth
              variant="outlined"
              onClick={() => onRemoveConnection(interestId)}
              sx={{
                flex: 1,
                borderRadius: "10px",
                py: 0.9,
                textTransform: "none",
                fontWeight: 600,
                fontSize: { xs: "0.78rem", sm: "0.82rem" },
                color: "#d32f2f",
                borderColor: "rgba(211,47,47,0.4)",
                "&:hover": {
                  background: "rgba(211,47,47,0.06)",
                  borderColor: "#d32f2f",
                },
              }}
            >
              Remove Connection
            </Button>
          )}

          {showCancelButton && (
            <Button
              fullWidth
              variant="outlined"
              onClick={() => onCancelRequest(interestId)}
              sx={{
                flex: 1,
                borderRadius: "10px",
                py: 0.9,
                textTransform: "none",
                fontWeight: 600,
                fontSize: { xs: "0.78rem", sm: "0.82rem" },
                color: "#888",
                borderColor: "rgba(0,0,0,0.2)",
                "&:hover": {
                  background: "rgba(0,0,0,0.04)",
                  borderColor: "rgba(0,0,0,0.35)",
                },
              }}
            >
              Cancel Request
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserCard;

export const ProfileInfo = ({ label, value }) => (
  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", px: 0.5 }}>
    <Typography
      variant="caption"
      sx={{
        fontWeight: 700,
        color: "#1a4f72",
        fontSize: "0.68rem",
        letterSpacing: "0.3px",
        textTransform: "uppercase",
      }}
    >
      {label}
    </Typography>
    <Typography variant="body2" sx={{ color: "#333", fontWeight: 500, fontSize: "0.82rem" }}>
      {value}
    </Typography>
  </Box>
);
