import React from 'react'
import Button from '@mui/material/Button'

const ThemedButton = ({
  title,
  onClick,
  sx,
  style,
  ...rest
}) => {
  return (
    <Button
      onClick={onClick}
      sx={{
        color:'#fff',
        backgroundColor: '#1a4f72',
        '&:hover': { backgroundColor: '#1a4f72' },
        borderRadius: '8px',
        textTransform: 'capitalize',
        ...sx,
      }}
      style={style}
      {...rest}
    >
      {title}
    </Button>
  )
}

export default ThemedButton