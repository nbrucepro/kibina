import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { CircularProgress, Typography, useMediaQuery } from '../../../node_modules/@mui/material/index';
import { database } from 'config/direabse.config';
import { collection,addDoc,  
  doc,
  updateDoc,
    // getDoc,
    getDocs,
    query,
    where, } from 'firebase/firestore';
import { gutiraFromfir } from 'store/reducers/menu';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';

const gutiraDb = collection(database, 'gutira');
function FormDialog() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('kamalijohn');
  
  const {selectedmonth} = useSelector(state=>state.menu);
  const {gutiradata} = useSelector((state) => state.menu);
  const [monthValue, setmonthValue] = React.useState(selectedmonth);
  console.log("selectedmonth",monthValue);
  const dispatch = useDispatch();
  const getgutira = async(month)=>{
    const q = query(gutiraDb, where("usernames", "==", "John Kamali"),where("month", "==", month));
    const ridesSnapshot = await getDocs(q);
    const ridesData = []
    if(ridesSnapshot?.docs?.length > 0){
      ridesData.push(ridesSnapshot?.docs[0]?.data())
    }
    console.log(ridesData)
    dispatch(gutiraFromfir(ridesData))
  }
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const yearStatus = [
    {
      value: 'kamalijohn',
      label: 'John kamali'
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

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('lg'));
  console.log(fullScreen)
  const [loading,setLoading] = React.useState(false);
  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Guza
      </Button>
      <Dialog
    open={open}
    onClose={handleClose}
    // fullScreen={true}
    PaperProps={{
        component: 'form',
        onSubmit: async (event) => {
            event.preventDefault();
            setLoading(true)
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const loan = parseInt(formJson.loan);
            const paid = parseInt(formJson.paid);
            const querySnapshot = await getDocs(query(gutiraDb, where("usernames", "==", "John Kamali"),where("month", "==", selectedmonth)));
          if (!querySnapshot.empty) {
            const docSnapshot = querySnapshot.docs[0];
            const alreadpaid = docSnapshot.data().paid + paid;
            const debt = Math.round((docSnapshot?.data()?.loanwithintereset - paid));
            console.log("debt",debt);
            const interest = Math.round((debt * 5)/100);
            const loanwithintereset =Math.round(interest + debt);
            console.log(interest + debt);
                await updateDoc(doc(gutiraDb, docSnapshot.id), {
                  loan:docSnapshot?.data()?.loan,
                  interest,
                  loanwithintereset,
                  paid:alreadpaid,
                  debt
                });
                getgutira(selectedmonth);
            } else {
              await addDoc(gutiraDb,{
                usernames:"John Kamali",
                year:2014,
                month:selectedmonth,
                loan,
                interest:(loan * 5)/100,
                loanwithintereset:(loan + (loan * 5)/100),
                paid,
                debt:((loan + ((loan * 5)/100)) - paid)
              })
              getgutira(selectedmonth);
            }
            setLoading(false)
            handleClose(); // Close the dialog
        }
    }}
>

        <DialogTitle sx={{ my: 0.5, fontSize: '1.875rem' }}>gutira</DialogTitle>
        <DialogContent sx={{width:"700px"}}>
          <Typography>Amazina</Typography>
          <TextField
            id="standard-select-currency"
            //   size="small"
            fullWidth
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
          <Typography sx={{mt:2}}>Ukwezi</Typography>
          <TextField
            id="standard-select-currency"
            //   size="small"
            name="month"
            fullWidth
            select
            value={selectedmonth}
            disabled={true}
            onChange={(e) => setmonthValue(e.target.value)}
            sx={{ '& .MuiInputBase-input': { py: 0.5, fontSize: '0.875rem' } }}
          >
            {monthStatus.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField disabled={gutiradata[0]?.loan > 0} defaultValue={gutiradata[0]?.loan} autoFocus required margin="dense" id="name" name="loan" label="Umubare w' ayagujijwe" type="number" fullWidth variant="standard" />
          <TextField autoFocus required margin="dense" defaultValue={0} id="name" name="paid" label="Umubare w' ayishyuwe" type="number" fullWidth variant="standard" />
        </DialogContent>
        <DialogActions sx={{mx:"auto",my:3}}>
          {loading ? <CircularProgress /> : (
            <>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Save</Button>
          </>
          )}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
export default FormDialog;