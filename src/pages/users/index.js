import { useEffect, useState } from 'react';

// material-ui
import { Grid, MenuItem, TextField, Box } from '@mui/material';

// project import
import OrdersTable from './OrdersTable';
import MainCard from 'components/MainCard';
import FormDialog from './oModal';
import { useDispatch } from 'react-redux';
import { kuguzaFromfir, membersFromfir, setselectedmonth } from 'store/reducers/menu';
import {
  collection,
  // doc,
  // getDoc,
  getDocs,
  query,
  where
} from 'firebase/firestore';
import { database } from 'config/direabse.config';

// import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';

// assets

// sales report status
const yearStatus = [
  {
    value: '2024',
    label: '2023'
  }
];

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const membersDb = collection(database, 'members');
const Users = () => {
  const [value, setValue] = useState('2024');
  const [monthValue, setmonthValue] = useState('month1');
  // const [slot, setSlot] = useState('week');
  const dispatch = useDispatch();
  const getMembers = async () => {
    const q = query(membersDb);
    const ridesSnapshot = await getDocs(q);
    const ridesData = [];
    for (const members of ridesSnapshot?.docs) {
      ridesData.push({...members.data()});
    }
    dispatch(membersFromfir(ridesData));
  };
  useEffect(() => {
    getMembers();
  }, []);
  useEffect(() => {
    dispatch(setselectedmonth(monthValue));
  }, [monthValue]);
  return (
    <Grid rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />
      <Grid item xs={12} md={12} lg={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex' }}>
            <Grid item sx={{ mr: 1 }}>
              <TextField
                id="standard-select-currency"
                size="small"
                select
                value={value}
                onChange={(e) => setValue(e.target.value)}
                sx={{ '& .MuiInputBase-input': { py: 0.5, fontSize: '0.875rem' } }}
              >
                {yearStatus.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Box>
          <Grid item>
            {/* <Typography variant="h5" sx={{ cursor: 'pointer' }}>
              Add new
            </Typography> */}
            <FormDialog monthValue={monthValue} />
          </Grid>
          {/* <Grid item /> */}
        </Grid>
      </Grid>

      {/* row 3 */}

      <Grid item xs={12} md={12} lg={12}>
        <MainCard sx={{ mt: 1 }} content={false}>
          <OrdersTable />
        </MainCard>
      </Grid>
      {/* here */}
    </Grid>
  );
};

export default Users;
