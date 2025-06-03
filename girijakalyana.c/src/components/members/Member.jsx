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
import "./Members.scss";
import Footer from "../footer/Footer";
import { useGetRecentRegisters } from "../api/Auth";

const Members = () => {
  const isLargeScreen = useMediaQuery("(min-width:1200px)");
  const isMediumScreen = useMediaQuery("(min-width:900px)");
  const isSmallScreen = useMediaQuery("(min-width:600px)");
  const {data:recentregisters} = useGetRecentRegisters()

  

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
          marginTop: { xs: 3, sm: 5 },
          marginBottom: { xs: 5, sm: 10 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "#182848",
            fontWeight: "bold",
            fontFamily: "Outfit, sans-serif",
            fontSize: { xs: "1.5rem", sm: "2rem" },
            marginBottom: 5,
            marginTop:3
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
              <SwiperSlide >
                <Box
                  className="member-card"
                  sx={{
                    fontFamily: "Outfit, sans-serif",
                    px: { xs: 1, sm: 0 },
                    pb: 2,
                  }}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      borderRadius: 2,
                      overflow: "hidden",
                      position: "relative",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      p: 3,
                      background: "linear-gradient(to right, #182848, #4d75d4)",
                      color: "white",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        textAlign: "center",
                        color: "white",
                        mb: 2,
                        fontWeight: "bold",
                        fontFamily: "Outfit, sans-serif",
                        textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      Girija❤️Kalyana
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
                        { label: "Education:", value: member.educational_qualification },
                        { label: "Occupation:", value: member.occupation },
                        { label: "City:", value: member.city },
                      ].map((item, index) => (
                        <Box key={index} sx={{ display: "flex" }}>
                          <Typography
                            variant="body1"
                            sx={{
                              ml:3,
                              fontWeight: "bold",
                              width: "100px",
                              fontFamily: "Outfit, sans-serif",
                              color: "#fff",
                              display:"flex",
                            }}
                          >
                            {item.label}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              fontFamily: "Outfit, sans-serif",
                              color: "#fff",
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
