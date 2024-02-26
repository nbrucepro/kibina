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
import { gutiraFromfir } from 'store/reducers/menu';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';

const gutiraDb = collection(database, 'gutira');
const sreportDb = collection(database, 'sreport');
function FormDialog() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(null);
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
  const { gutiradata } = useSelector((state) => state.menu);
  const { membersdata } = useSelector((state) => state.menu);
  const [monthValue, setmonthValue] = React.useState(selectedmonth);
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
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setloana(0);
    setisthere(0);
    setValue(null);
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
  function toscapitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  const [loading, setLoading] = React.useState(false);
  const [usersm, setUsersm] = React.useState([]);
  React.useEffect(() => {
    const mm = [];
    if (membersdata?.length > 0) {
      for (const me of membersdata) {
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
    for (const kug of gutiradata) {
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
        {/* {(premonth && gutiradata[0][premonth].debt)>0 ? "Ishyura ideni": "Guza"} */} Tira
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
            // const debt = loan - paiD
            const month = formJson.month;

            // Query Firestore to get the document
            const querySnapshot = await getDocs(query(gutiraDb, where('nid', '==', value)));
            const querySnapshotWithdept = await getDocs(query(gutiraDb, where('nid', '==', value), where('sharedebt', '>', 0)));
            const querySnapshot2 = await getDocs(query(sreportDb));

            if (querySnapshot.empty) {
              const ind = 12;
              const iterableArray = Array.from({ length: ind }, (_, index) => index + 1);
              const data = {
                year: 2024,
                nid: value,
                sharedebt: 0
              };

              iterableArray.forEach((id) => {
                data[`month${id}`] = {
                  loan: 0,
                  interest: 0,
                  loanwithintereset: 0,
                  paid: 0,
                  debt: 0,
                  prevdebt: 0
                };
              });
              await addDoc(gutiraDb, data);
              getgutira(selectedmonth);
            } else {
              if (!querySnapshotWithdept.empty) {
                const docSnapshot = querySnapshot.docs[0];
                // const debtmonth = querySnapshot.docs[0].month;
                const sharedebtM = `month${docSnapshot.data()?.sharedebt}`;
                const docDataPrevMonth = docSnapshot.data()[sharedebtM];
                const alreadpaid = docDataPrevMonth.paid + paid;
                const debt = docDataPrevMonth?.loanwithintereset !== 0 ? docDataPrevMonth?.loanwithintereset - paid : loan;
                const prevsharedebt = parseInt(selectedmonth.match(/\d+$/)[0]);
                const ubukererwe = prevsharedebt - docSnapshot.data()?.sharedebt >= 2
                console.log("ubukererwe",ubukererwe)
                const interest = ubukererwe ? (debt * 7) / 100 :(debt * 5) / 100;
                const loanwithintereset = interest + debt;
                const theextras = loanwithintereset < 0 ? Math.abs(loanwithintereset) : 0;
                const ind = 12;
                const iterableArray = Array.from({ length: ind }, (_, index) => index + 1);
                const sharedebt = debt === 0 ? parseInt(0) : docSnapshot.data()?.sharedebt;
                const data = { sharedebt };
                iterableArray.forEach((id) => {
                  if (`month${id}` === sharedebtM) {
                    data[`${sharedebtM}`] = {
                      loan: docSnapshot.data()[`month${id}`]?.loan>0 ? docSnapshot.data()[`month${id}`]?.loan: Math.round(loan),
                      interest: theextras == 0 ? Math.round(interest) : 0,
                      loanwithintereset: Math.round(loanwithintereset),
                      paid: Math.round(alreadpaid),
                      debt: Math.round(debt),
                      prevdebt: Math.round(loanwithintereset),
                      theextras
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
                await updateDoc(doc(gutiraDb, docSnapshot.id), data);
                // await updateDoc(doc(sreportDb, querySnapshot2.docs[0].id), {
                //             ayishyuweGutira: querySnapshot2.docs[0].data().ayishyuweGutira+paid,
                //             gutiraDept: ((querySnapshot2.docs[0].data().ayishyuweGutira + paid )- querySnapshot2.docs[0].data().ayatiriweTotal) 
                //           });
                getgutira(selectedmonth);
              } else {
                const ind = 12;
                const iterableArray = Array.from({ length: ind }, (_, index) => index + 1);

                const docSnapshot = querySnapshot.docs[0];
                const docDataPrevMonth = selectedmonth === 'month1' ? docSnapshot.data()[selectedmonth] : docSnapshot.data()[selectedmonth];
                const alreadpaid = paid ? docDataPrevMonth.paid + paid : docDataPrevMonth.paid;
                const debt = docDataPrevMonth?.loanwithintereset !== 0 ? docDataPrevMonth?.loanwithintereset - paid : loan;
                const interest = (debt * 5) / 100;
                const loanwithintereset = interest + debt;
                const sharedebt = parseInt(selectedmonth.match(/\d+$/)[0]);
                const data = { sharedebt };
                iterableArray.forEach((id) => {
                  if (`month${id}` === selectedmonth) {
                    data[`${selectedmonth}`] = {
                      loan: docSnapshot.data()[`month${id}`]?.loan>0 ? docSnapshot.data()[`month${id}`]?.loan: Math.round(loan),
                      interest: Math.round(interest),
                      loanwithintereset: Math.round(loanwithintereset),
                      paid: Math.round(alreadpaid),
                      debt: Math.round(debt),
                      prevdebt: Math.round(loanwithintereset)
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
                await updateDoc(doc(gutiraDb, docSnapshot.id), data);
                // await updateDoc(doc(sreportDb, querySnapshot2.docs[0].id), {
                //   ayatiriweTotal: querySnapshot2.docs[0].data().ayatiriweTotal+loan 
                // });
                getgutira(selectedmonth);
              }
            }
            setLoading(false);
            handleClose(); // Close the dialog
          }
        }}
      >
        <DialogTitle sx={{ my: 0.5, fontSize: '1.875rem' }}>{gutiradata.length > 0 && loana > 0 ? 'Ishyura ideni' : 'gutira'}</DialogTitle>
        {/* <DialogTitle sx={{ my: 0.5, fontSize: '1.875rem' }}>gutira</DialogTitle> */}
        <DialogContent sx={{ width: '700px' }}>
          <Typography>Amazina</Typography>
          <TextField
            id="standard-select-currency"
            fullWidth
            select
            required
            // value={value === null ? ' <em style={{color:"gray"}}>Select an option</em>' : value}
            value={value}
            onChange={(e) => {
              console.log('e.target.value', e.target.value);
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
            {/* Other MenuItems */}
            {usersm.map((option) => (
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
          {/* {(selectedmonth && gutiradata.length > 0) && (
            <> */}
          {/* {gutiradata.length} */}
          {/* {(selectedmonth && gutiradata.length > 0 ) && (
              <TextField disabled={gutiradata[0][selectedmonth]?.prevdebt > 0} defaultValue={gutiradata[0][selectedmonth]?.prevdebt} autoFocus label="Ideni arimo" type="number" fullWidth variant="standard" />
            )}   */}
          {/* </>
            )}   */}
          {gutiradata.length > 0 && (
            <TextField
              value={loana}
              disabled={isthere > 0}
              autoFocus
              required
              margin="dense"
              id="name"
              label="Umubare w'ayatiwe"
              type="number"
              fullWidth
              variant="standard"
              onChange={onloanachange}
            />
          )}
          {/* {(gutiradata[0][selectedmonth]?.prevdebt > 0) && ( */}
          {isthere > 0 && (
            <TextField
            autoFocus
            required
            margin="dense"
            defaultValue={0}
            id="name"
            name="paid"
            label="Umubare w' ayishyuwe"
            type="number"
            fullWidth
            variant="standard"
            />
            )}
          {/* // )} */}
          {/* </> */}
          {/* // )} */}
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
