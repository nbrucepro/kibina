// project import
import Navigation from './Navigation';
import SimpleBar from 'components/third-party/SimpleBar';
import { IconButton, Typography, Box } from '@mui/material';
import { LogoutOutlined } from '@ant-design/icons';

// ==============================|| DRAWER CONTENT ||============================== //

const DrawerContent = () => (
  <SimpleBar
    sx={{
      '& .simplebar-content': {
        display: 'flex',
        flexDirection: 'column'
      }
    }}
  >
    <Navigation />
    <Box sx={{display:"flex",position:"relative", top:"40%",alignItems:"center",cursor:"pointer",
            '&:hover': {
              bgcolor: 'primary.lighter'
            },
    }}

      onClick={() => {
        localStorage.removeItem('userm')
        window.location.reload()
      }}
    >
    <IconButton
      size="large"
      color="red"
      sx={{color:"red",hover:"none",ml:2,
      '&:hover': {
        bgcolor: 'primary.lighter'
      },
      }}
      >
      <LogoutOutlined /> 
    </IconButton>
      <Typography color="red">Logout</Typography>
      </Box>
  </SimpleBar>
);

export default DrawerContent;
