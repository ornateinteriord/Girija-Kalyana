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
  const { data: recentregisters } = useGetRecentRegisters();

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
            color: "#63084e",
            fontWeight: "bold",
            fontFamily: "Outfit, sans-serif",
            fontSize: { xs: "1.5rem", sm: "2rem" },
            mb: 5,
            mt: 3,
          }}
        >
          RECENT REGISTERS
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
                    pb: 2,
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                    },
                  }}
                >
                  <Paper
                    elevation={6}
                    sx={{
                      borderRadius: 4,
                      p: 3,
                      background: "linear-gradient(to right, #182848, #4d75d4)",
                      color: "#fff",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        textAlign: "center",
                        fontWeight: "bold",
                        mb: 2,
                        textShadow: "0 2px 4px rgba(0, 0, 0, 0.4)",
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
                              fontWeight: "bold",
                              width: "100px",
                              color: "#fff",
                            }}
                          >
                            {item.label}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              color: "#fff",
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