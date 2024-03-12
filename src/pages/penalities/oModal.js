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
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  // getDoc,
  getDocs,
  query,
  where
} from 'firebase/firestore';
import { penalitiesFromfir } from 'store/reducers/menu';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';

const penalitiesDb = collection(database, 'penalities');
const sreportDb = collection(database, 'sreport');
function FormDialog() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(null);
  const [reasonValue, setReasonValue] = React.useState(null);
  const [premonth, setpremonth] = React.useState(null);
  let pre = 0;
  const { selectedmonth } = useSelector((state) => state.menu);
  React.useEffect(() => {
    if (selectedmonth.length > 0) {
      pre = selectedmonth.match(/\d+$/)[0];
    }
    if (selectedmonth.match(/\bmonth1\b/)) {
      setpremonth(null);
    } else {
      setpremonth(`month${pre - 1}`);
    }
  }, [selectedmonth]);
  const [loana, setloana] = React.useState(0);
  const [isthere, setisthere] = React.useState(0);
  const { kuguzadata } = useSelector((state) => state.menu);
  const { membersdata } = useSelector((state) => state.menu);
  const [monthValue, setmonthValue] = React.useState(selectedmonth);
  const dispatch = useDispatch();
  const usersmString = localStorage.getItem('userm');
  const loggedInusersm = usersmString ? JSON.parse(usersmString) : null;
  const getKuguza = async () => {
    const ridesSnapshot = await getDocs(penalitiesDb);
    const ridesData = [];
    for (const members of ridesSnapshot?.docs) {
      ridesData.push({ ...members.data() });
    }
    dispatch(penalitiesFromfir(ridesData));
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setloana(0);
    setisthere(0);
    setValue(null);
    setReasonValue(null);
  };
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

  const reasonsOptions = [
    {
      value: 'Gukererwa',
      label: 'Gukererwa'
    },
    {
      value: 'Gusiba',
      label: 'Gusiba'
    },
  ];

  function toscapitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  const [loading, setLoading] = React.useState(false);
  const [usersm, setUsersm] = React.useState([]);
  // const updates = async(me)=>{
  //   const kuguzajson = { 
  //     nid:me,
  //     year:2024
  //   }
  //   const iterableArray = Array.from({ length: 12 }, (_, index) => index + 1);
  //   iterableArray.forEach((id) => {
  //     kuguzajson[`month${id}`] = {
  //       reason: "",
  //       paid: 0,
  //     };      
  //   });
  //   console.log(kuguzajson)
  //   console.log(me)
  //   // const querySnapshot = await getDocs(query(penalitiesDb, where('nid', '==', me)));
  //   // console.log(querySnapshot.docs[0].id);
  //   // if(!querySnapshot.empty){
  //   //   const docSnapshot = querySnapshot.docs[0]; 
  //   //   console.log("hihih",querySnapshot.docs[0]?.id)
  //   //   // await updateDoc(doc(penalitiesDb,querySnapshot.docs[0]?.id),kuguzajson)
  //   //   await updateDoc(doc(penalitiesDb, docSnapshot.id), kuguzajson);
  //   // }
  //     // await addDoc(penalitiesDb, kuguzajson);
  // }
  React.useEffect(() => {
    const mm = [];
    if (membersdata?.length > 0) {
      for (const me of membersdata) {
        // updates(me?.nid)
        if(me.role !== 1){
          mm.push({
            id: me?.nid,
            value: me?.nid,
            label: `${toscapitalize(me?.names)}`
          });
        }
      }
      setUsersm(mm);
    }
  }, [membersdata]);
  function membersdatafilter(value) {
    for (const kug of kuguzadata) {
      if (kug?.nid === value) {
        if (kug.month2.prevdebt > 0) {
          setloana(kug.month2.prevdebt);
          setisthere(kug.month2.prevdebt);
        } else {
          setisthere(0);
          setloana(0);
        }
      }
    }
  }

  const onloanachange = (e) => {
    setloana(parseInt(e.target.value));
  };
  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add new
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        // fullScreen={true}
        PaperProps={{
          component: 'form',
          onSubmit: async (event) => {
            event.preventDefault();
            setLoading(true);
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const loan = loana;
            const paid = parseInt(formJson.paid);
            const month = formJson.month;
            const querySnapshot = await getDocs(query(penalitiesDb, where('nid', '==', value)));
              if (!querySnapshot.empty) {
                const docSnapshot = querySnapshot.docs[0];
                const sharedebtM = `month${docSnapshot.data()?.sharedebt}`;
                const docDataPrevMonth = docSnapshot.data()[sharedebtM];
                const alreadpaid = docDataPrevMonth.paid + paid;
                const loanwithintmathed= docDataPrevMonth?.loanwithintereset - paid < 0 ? 0 : docDataPrevMonth?.loanwithintereset - paid
                const debt = docDataPrevMonth?.loanwithintereset !== 0 ? loanwithintmathed : loan;
                const interest = (debt * 3) / 100;
                const loanwithintereset = interest + debt;
                // const theextras = loanwithintereset < 0 ? Math.abs(loanwithintereset) : 0;
                const ind = 12;
                const iterableArray = Array.from({ length: ind }, (_, index) => index + 1);
                const sharedebt = debt === 0 ? parseInt(0) : docSnapshot.data()?.sharedebt;
                const data = { sharedebt };
                iterableArray.forEach((id) => {
                  if (`month${id}` === sharedebtM) {
                    data[`${sharedebtM}`] = {
                      loan: docSnapshot.data()[`month${id}`]?.loan>0 ? docSnapshot.data()[`month${id}`]?.loan: Math.round(loan),
                      interest: Math.round(interest),
                      // interest: theextras == 0 ? Math.round(interest) : 0,
                      loanwithintereset: Math.round(loanwithintereset),
                      paid: Math.round(alreadpaid),
                      debt: Math.round(debt),
                      prevdebt: Math.round(loanwithintereset),
                      // theextras
                    };
                  } else {
                    data[`month${id}`] = {
                      loan: docSnapshot.data()[`month${id}`]?.loan,
                      interest: docSnapshot.data()[`month${id}`]?.interest,
                      loanwithintereset: docSnapshot.data()[`month${id}`]?.loanwithintereset,
                      paid: docSnapshot.data()[`month${id}`]?.paid,
                      debt: docSnapshot.data()[`month${id}`]?.debt,
                      prevdebt: loanwithintereset
                    };
                  }
                });
                await updateDoc(doc(penalitiesDb, docSnapshot.id), data);
                getKuguza(selectedmonth);
              } else {
                const ind = 12;
                const iterableArray = Array.from({ length: ind }, (_, index) => index + 1);
                const data = { 
                       nid:value,
                       year:2024
                };
                iterableArray.forEach((id) => {
                  console.log(`month${id}`);
                  console.log(`month${id}` === selectedmonth)
                  if (`month${id}` === selectedmonth) {
                          data[`month${id}`] = {
                            reason: reasonValue,
                            paid: paid,
                          }; 
                  } 
                });
                console.log(data);
                await addDoc(penalitiesDb, data);
                getKuguza(selectedmonth);
              }
            // }
            setLoading(false);
            handleClose(); // Close the dialog
          }
        }}
      >
        <DialogTitle sx={{ my: 0.5, fontSize: '1.875rem' }}>{kuguzadata.length > 0 && loana > 0 ? 'Ishyura ideni' : 'Kuguza'}</DialogTitle>
        {/* <DialogTitle sx={{ my: 0.5, fontSize: '1.875rem' }}>Kuguza</DialogTitle> */}
        <DialogContent sx={{ width: '700px' }}>
          <Typography>Amazina</Typography>
          <TextField
            id="standard-select-currency"
            fullWidth
            select
            required
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              membersdatafilter(e.target.value);
            }}
            SelectProps={{
              displayEmpty: true,
              renderValue: (selected) => {
                if (!selected) {
                  return <em style={{ color: 'gray' }}>Select an option</em>;
                }
                const selectedOption = usersm.find((option) => option.value === selected);
                return selectedOption ? selectedOption.label : '';
              }
            }}
            sx={{ '& .MuiInputBase-input': { py: 0.5, fontSize: '0.875rem' } }}
          >
            {usersm.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Typography sx={{ mt: 2 }}>Impamvu</Typography>
          <TextField
            id="standard-select-currency"
            fullWidth
            select
            required
            value={reasonValue}
            onChange={(e) => {
              setReasonValue(e.target.value);
            }}
            SelectProps={{
              displayEmpty: true,
              renderValue: (selected) => {
                if (!selected) {
                  return <em style={{ color: 'gray' }}>Select an option</em>;
                }
                const selectedOption = reasonsOptions.find((option) => option.value === selected);
                return selectedOption ? selectedOption.label : '';
              }
            }}
            sx={{ '& .MuiInputBase-input': { py: 0.5, fontSize: '0.875rem' } }}
          >
            {reasonsOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <Typography sx={{ mt: 2 }}>Ukwezi</Typography>
          <TextField
            id="standard-select-currency"
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
          <TextField
            autoFocus
            required
            margin="dense"
            defaultValue={0}
            id="name"
            name="paid"
            label="Amafaranga"
            type="number"
            fullWidth
            variant="standard"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ mx: 'auto', my: 3 }}>
          {loading ? (
            <CircularProgress />
          ) : (
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
