import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  ButtonBase,
  CardContent,
  ClickAwayListener,
  Grid,
  IconButton,
  Paper,
  Popper,
  Stack,
  Tab,
  Tabs,
  Typography
} from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';
import ProfileTab from './ProfileTab';
import SettingTab from './SettingTab';

// assets
import dummAvatar from 'assets/images/users/avatar-1.png';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';

// tab panel wrapper
function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`profile-tabpanel-${index}`} aria-labelledby={`profile-tab-${index}`} {...other}>
      {value === index && children}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`
  };
}

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

const Profile = () => {
  const dummAvatar =
    "data:image/jpeg;base64,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";
  const theme = useTheme();

  const handleLogout = async () => {
    // logout
  };

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    // setOpen((prevOpen) => !prevOpen);
    
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const iconBackColorOpen = 'grey.300';
  const usersmString = localStorage.getItem("userm");
  const usersm = usersmString ? JSON.parse(usersmString) : null;
  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <ButtonBase
        sx={{
          p: 0.25,
          bgcolor: open ? iconBackColorOpen : 'transparent',
          borderRadius: 1,
          '&:hover': { bgcolor: 'secondary.lighter' }
        }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 0.5 }}>
          <Avatar alt="profile user" src={dummAvatar} sx={{ width: 32, height: 32 }} />
          <Typography variant="subtitle1">{usersm?.names?.toUpperCase()}</Typography>
        </Stack>
      </ButtonBase>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 9]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            {open && (
              <Paper
                sx={{
                  boxShadow: theme.customShadows.z1,
                  width: 290,
                  minWidth: 240,
                  maxWidth: 290,
                  [theme.breakpoints.down('md')]: {
                    maxWidth: 250
                  }
                }}
              >
                <ClickAwayListener onClickAway={handleClose}>
                  <MainCard elevation={0} border={false} content={false}>
                    <CardContent sx={{ px: 2.5, pt: 3 }}>
                      <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                          <Stack direction="row" spacing={1.25} alignItems="center">
                            <Avatar alt="profile user" src={dummAvatar} sx={{ width: 32, height: 32 }} />
                            <Stack>
                              <Typography variant="h6">John Doe</Typography>
                              <Typography variant="body2" color="textSecondary">
                                UI/UX Designer
                              </Typography>
                            </Stack>
                          </Stack>
                        </Grid>
                        <Grid item>
                          <IconButton size="large" color="secondary" onClick={handleLogout}>
                            <LogoutOutlined />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </CardContent>
                    {open && (
                      <>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                          <Tabs variant="fullWidth" value={value} onChange={handleChange} aria-label="profile tabs">
                            <Tab
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textTransform: 'capitalize'
                              }}
                              icon={<UserOutlined style={{ marginBottom: 0, marginRight: '10px' }} />}
                              label="Profile"
                              {...a11yProps(0)}
                            />
                            <Tab
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textTransform: 'capitalize'
                              }}
                              icon={<SettingOutlined style={{ marginBottom: 0, marginRight: '10px' }} />}
                              label="Setting"
                              {...a11yProps(1)}
                            />
                          </Tabs>
                        </Box>
                        <TabPanel value={value} index={0} dir={theme.direction}>
                          <ProfileTab handleLogout={handleLogout} />
                        </TabPanel>
                        <TabPanel value={value} index={1} dir={theme.direction}>
                          <SettingTab />
                        </TabPanel>
                      </>
                    )}
                  </MainCard>
                </ClickAwayListener>
              </Paper>
            )}
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default Profile;
