import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  useMediaQuery,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import Footer from "../footer/Footer";
import { useGetRecentRegisters } from "../api/Auth";

const Members = () => {
  const isLargeScreen = useMediaQuery("(min-width:1200px)");
  const isMediumScreen = useMediaQuery("(min-width:900px)");
  const isSmallScreen = useMediaQuery("(min-width:600px)");
  const { data: recentregisters = [] } = useGetRecentRegisters();

  const getSlidesPerView = () => {
    if (isLargeScreen) return 3;
    if (isMediumScreen) return 2;
    if (isSmallScreen) return 1.5;
    return 1;
  };

  return (
    <>
      <Container
        sx={{
          textAlign: "center",
          mt: { xs: 3, sm: 5 },
          mb: { xs: 5, sm: 10 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "#1a4f72",
            textTransform: "capitalize",
            fontFamily: "Outfit, sans-serif",
            fontSize: { xs: "1.5rem", sm: "2rem" },
            mb: 5,
            mt: 3,
          }}
        >
          Recent Registers
        </Typography>

        <Box sx={{ px: { xs: 0, sm: 2 } }}>
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={getSlidesPerView()}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            speed={1000}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            loop
          >
            {recentregisters?.map((member) => (
              <SwiperSlide key={member._id}>
                <Box
                  sx={{
                    px: { xs: 1, sm: 0 },
                    pb: 4,
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                    },
                  }}
                >
                  <Paper
                    elevation={6}
                    sx={{
                      borderRadius: 2,
                      p: 4,
                      background:
                        "linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)",
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.13)",
                      height: "380px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "start",
                      alignItems: "start",
                      textAlign: "start",
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        textAlign: "left",
                        fontWeight: 700,
                        mb: 2,
                        textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      Girija ❤️ Kalyana
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                      }}
                    >
                      {[
                        { label: "RegNo:", value: member.registration_no },
                        { label: "Name:", value: member.name },
                        { label: "Age:", value: member.age },
                        { label: "Caste:", value: member.caste },
                        {
                          label: "Education:",
                          value: member.educational_qualification,
                        },
                        { label: "Occupation:", value: member.occupation },
                        { label: "City:", value: member.city },
                      ].map((item, index) => (
                        <Box key={index} sx={{ display: "flex", gap: 1 }}>
                          <Typography
                            variant="body1"
                            sx={{
                              textAlign: "left",
                              fontWeight: 600,
                              width: "100px",
                              color: "#000",
                            }}
                          >
                            {item.label}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 400,
                              textAlign: "left",
                              color: "#000",
                              wordBreak: "break-word",
                            }}
                          >
                            {item.value}
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
      <Footer />
    </>
  );
};

export default Members;
