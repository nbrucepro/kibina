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
  updateDoc,
  doc,
  // getDoc,
  getDocs,
  query,
  where
} from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { ingobokaFromfir } from 'store/reducers/menu';

const guturaDb = collection(database, 'ingoboka');
const sreportDb = collection(database, 'sreport');
function FormDialog() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState();
  const [idTouse, setidTouse] = React.useState();
  const [monthValue, setmonthValue] = React.useState('month1');
  const dispatch = useDispatch();
  const usersmString = localStorage.getItem('userm');
  const loggedInusersm = usersmString ? JSON.parse(usersmString) : null;
  const getGutura = async () => {
    const q = loggedInusersm?.role === 0 ? query(guturaDb, where('nid', '==', loggedInusersm?.nid)) : query(guturaDb);
    const ridesSnapshot = await getDocs(q);
    const ridesData = [];
    for (const members of ridesSnapshot?.docs) {
      ridesData.push({ ...members.data() });
    }
    dispatch(ingobokaFromfir(ridesData));
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  function toscapitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  const [usersm, setUsersm] = React.useState([]);
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

  const [loading, setLoading] = React.useState(false);

  const { membersdata } = useSelector((state) => state.menu);
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
      setValue(membersdata[0]?.nid || '');
    }
  }, [membersdata]);
  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Ingoboka
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
            const amount = parseInt(formJson.amount);
            const month = formJson.month;

            // Query Firestore to get the document
            const querySnapshot = await getDocs(query(guturaDb, where('nid', '==', value)));
            const querySnapshot2 = await getDocs(query(sreportDb));

            if (!querySnapshot.empty) {
              const docSnapshot = querySnapshot.docs[0];
              const docData = docSnapshot.data();
              let total = docData.total || 0;
              let ingobokaTotal =querySnapshot2.docs[0].data().ingobokaTotal || 0;
              if (docData[month] !== 0) {
                total -= docData[month];
              }
              await updateDoc(doc(guturaDb, docSnapshot.id), {
                [month]: amount,
                total: total + amount
              });
              // await updateDoc(doc(sreportDb, querySnapshot2.docs[0].id), {
              //   ingobokaTotal: ingobokaTotal+amount
              // });
              getGutura();
            } else {
              console.error("No document found for 'John Kamali'");
            }
            setLoading(false);
            handleClose(); // Close the dialog
          }
        }}
      >
        <DialogTitle sx={{ my: 0.5, fontSize: '1.875rem' }}>Ingoboka</DialogTitle>
        <DialogContent sx={{ width: '700px' }}>
          <Typography>Amazina</Typography>
          <TextField
            id="standard-select-currency"
            fullWidth
            select
            value={value}
            onChange={(e) => setValue(e.target.value)}
            sx={{ '& .MuiInputBase-input': { py: 0.5, fontSize: '0.875rem' } }}
          >
            {usersm?.map((option) => (
              <MenuItem key={option?.value} value={option?.value}>
                {option?.label}
              </MenuItem>
            ))}
          </TextField>
          {/* //   size="small" */}
          <Typography sx={{ mt: 2 }}>Ukwezi</Typography>
          <TextField
            id="standard-select-currency"
            name="month"
            fullWidth
            select
            value={monthValue}
            onChange={(e) => setmonthValue(e.target.value)}
            sx={{ '& .MuiInputBase-input': { py: 0.5, fontSize: '0.875rem' } }}
          >
            {monthStatus.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField autoFocus required margin="dense" id="name" name="amount" label="Amount" type="number" fullWidth variant="standard" />
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
