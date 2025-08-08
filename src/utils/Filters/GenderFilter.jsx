import { FormControl, MenuItem, Select } from '@mui/material'


const GenderFilter = ({selectedStatus,handleStatusChange}) => {
  return (
    <FormControl  sx={{ 
      width: { xs: '100%', sm: '200px' },
      fontFamily: '"Outfit", sans-serif'
    }} fontFamily={"Outfit sans-serif"}>
            <Select
              value={selectedStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              sx={{ 
                height: "50px",
                width: '100%',
                '& .MuiSelect-select': { 
                  display: 'flex',
                  alignItems: 'center'
                }
              }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="BrideGroom">Groom</MenuItem>
              <MenuItem value="Bride">Bride</MenuItem>
            </Select>
          </FormControl>
  )
}

export default GenderFilter
