import { useEffect, useState } from 'react';

// material-ui
import { Grid, MenuItem, TextField, Box } from '@mui/material';

// project import
import OrdersTable from './OrdersTable';
import MainCard from 'components/MainCard';
import FormDialog from './oModal';
import { useDispatch } from 'react-redux';
import { gutiraFromfir, setselectedmonth } from 'store/reducers/menu';
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
const monthStatus = [
  {
    value: 'month1',
    label: 'Ukwezi 1'
  },
  {
    value: 'month2',
    label: 'Ukwezi 2'
  },
  {
    value: 'month3',
    label: 'Ukwezi 3'
  },
  {
    value: 'month4',
    label: 'Ukwezi 4'
  },
  {
    value: 'month5',
    label: 'Ukwezi 5'
  },
  {
    value: 'month6',
    label: 'Ukwezi 6'
  },
  {
    value: 'month7',
    label: 'Ukwezi 7'
  },
  {
    value: 'month8',
    label: 'Ukwezi 8'
  },
  {
    value: 'month9',
    label: 'Ukwezi 9'
  },
  {
    value: 'month10',
    label: 'Ukwezi 10'
  },
  {
    value: 'month11',
    label: 'Ukwezi 11'
  },
  {
    value: 'month12',
    label: 'Ukwezi 12'
  }
];

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const gutiraDb = collection(database, 'gutira');
const Gutira = () => {
  const [value, setValue] = useState('2024');
  const [monthValue, setmonthValue] = useState('month1');
  // const [slot, setSlot] = useState('week');
  const dispatch = useDispatch();
  const usersmString = localStorage.getItem('userm');
  const loggedInusersm = usersmString ? JSON.parse(usersmString) : null;
  const getgutira = async (month) => {
    const q = loggedInusersm?.role === 0 ? query(gutiraDb, where('nid', '==', loggedInusersm?.nid)) : query(gutiraDb);
    const ridesSnapshot = await getDocs(q);
    const ridesData = [];
    for (const members of ridesSnapshot?.docs) {
      ridesData.push({ ...members.data() });
    }
    dispatch(gutiraFromfir(ridesData));
  };
  useEffect(() => {
    getgutira();
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
            <Grid item>
              <TextField
                id="standard-select-currency"
                size="small"
                select
                value={monthValue}
                onChange={(e) => {
                  setmonthValue(e.target.value);
                  // dispatch(setselectedmonth(e.target.value))
                }}
                sx={{ '& .MuiInputBase-input': { py: 0.5, fontSize: '0.875rem' } }}
              >
                {monthStatus.map((option) => (
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
            {loggedInusersm?.role === 1 && <FormDialog monthValue={monthValue} />}
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

export default Gutira;
