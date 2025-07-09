import React from "react";
import { Container, Typography, Box, Paper, useMediaQuery } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { useGetRecentRegisters } from "../api/Auth";

const Members = () => {
  const { data: recentregisters } = useGetRecentRegisters();
  
  // Media queries
  const isLargeScreen = useMediaQuery("(min-width:1200px)");
  const isMediumScreen = useMediaQuery("(min-width:900px)");
  const isSmallScreen = useMediaQuery("(min-width:600px)");

  const getSlidesPerView = () => {
    if (isLargeScreen) return 3;
    if (isMediumScreen) return 2;
    if (isSmallScreen) return 1.5;
    return 1;
  };

  return (
    <Container sx={{ textAlign: "center", my: 5 }}>
      <Typography variant="h4" sx={{ mb: 5, mt: 3 }}>
        RECENT REGISTERS
      </Typography>

      <Box sx={{ px: { xs: 0, sm: 2 } }}>
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          slidesPerView={getSlidesPerView()}
          autoplay={{ delay: 2500 }}
          navigation
          loop
        >
          {recentregisters?.map((member) => (
            <SwiperSlide key={member._id || member.registration_no}> {/* Fixed key */}
              <Box className="member-card" sx={{ px: { xs: 1, sm: 0 }, pb: 2 }}>
                <Paper elevation={3} sx={{ p: 3, background: "linear-gradient(to right, #182848, #4d75d4)", color: "white" }}>
                  <Typography variant="h4" sx={{ mb: 2 }}>
                    Girija❤️Kalyana
                  </Typography>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {[
                      { label: "RegNo:", value: member.registration_no },
                      { label: "Name:", value: member.name },
                      // ... other fields
                    ].map((item) => (
                      <Box key={`${member._id}-${item.label}`}> {/* Fixed nested key */}
                        <Typography variant="body1" sx={{ ml: 3, fontWeight: "bold" }}>
                          {item.label} {item.value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Container>
  );
};

export default Members;