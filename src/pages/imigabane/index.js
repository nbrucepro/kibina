import { useEffect, useState } from 'react';

// material-ui
import { Grid, MenuItem, TextField } from '@mui/material';

// project import
import OrdersTable from './OrdersTable';
import MainCard from 'components/MainCard';
// import { useSelector } from 'react-redux';
// import {addDoc,collection} from 'firebase/firestore'
// import { database } from 'config/direabse.config';
// import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';

// assets

// sales report status
const yearStatus = [
  {
    value: '2024',
    label: '2024'
  }
];


// ==============================|| DASHBOARD - DEFAULT ||============================== //

const Imigabane = () => {
  const [value, setValue] = useState('2024');
  // const [slot, setSlot] = useState('week');
  // const get
  // const { membersdata } = useSelector((state) => state.menu);
  // console.log(membersdata);
  // const instmigabane = async ()=>{
    
    // const imigabaneDb = collection(database, 'imigabane');
  //   for(let i = 0; i < membersdata.length; i++) {
  //     const ind = 12;
  //     const iterableArray = Array.from({ length: ind }, (_, index) => index + 1);
  //     const guturajson = {
  //       year: 2024,
  //       nid: parseInt(membersdata[i]?.nid),
  //       total:0
  //     };
    
  //     iterableArray.forEach((id) => {
  //       guturajson[`month${id}`] = 0
  //     });
  //   }
  // }
  // useEffect(()=>{
  //   instmigabane()
  // },[])

  const usersmString = localStorage.getItem('userm');
  const loggedInusersm = usersmString ? JSON.parse(usersmString) : null;
  return (
    <Grid rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />
      <Grid item xs={12} md={12} lg={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
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
            {/* {loggedInusersm?.role === 1 && <FormDialog />} */}
            {/* <Typography variant="h5" sx={{ cursor: 'pointer' }}>
              Add new
            </Typography> */}
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

export default Imigabane;
