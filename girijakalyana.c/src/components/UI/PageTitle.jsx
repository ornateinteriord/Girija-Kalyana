import { Typography, Box } from "@mui/material";

const PageTitle = ({ 
  title,
  align = "left",  
  size = "medium"  
}) => {
  const fontSize = {
    small: { xs: "1.1rem", sm: "1.3rem" },
    medium: { xs: "1.3rem", sm: "1.75rem" },
    large: { xs: "1.5rem", sm: "2rem" }
  };

  return (
    <Box sx={{ textAlign: align, mb: 3 }}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 500,
          color: "#212121",
          fontSize: fontSize[size]
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};

export default PageTitle;