import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, CircularProgress, Typography, useMediaQuery } from '../../../node_modules/@mui/material/index';
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
import { membersFromfir, toggleModals } from 'store/reducers/menu';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';

const membersDb = collection(database, 'members');
const kuguzaDb = collection(database, 'kuguza');
const gutiraDb = collection(database, 'gutira');
const guturaDb = collection(database, 'gutura');
function FormDialog() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('kamalijohn');
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

  const dispatch = useDispatch();
  const getMembers = async () => {
    const q = query(membersDb);
    const ridesSnapshot = await getDocs(q);
    const ridesData = [];
    for (const members of ridesSnapshot?.docs) {
      ridesData.push({ ...members.data() });
    }
    dispatch(membersFromfir(ridesData));
  };
  const { editmember } = useSelector((state) => state.menu.modals, shallowEqual);
  const { editData } = useSelector((state) => state.menu.modals, shallowEqual);
  const [telValue, setTelValue] = React.useState('');
  const [nidValue, setNidValue] = React.useState('');
  const [error, setRoor] = React.useState('');
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    dispatch(toggleModals({ editmember: false }));
    setRoor('');
    setTelValue('')
    setNidValue('')
  };

  React.useEffect(() => {
    editData?.nid && setNidValue(editData?.nid);
  }, [editData?.nid]);

  React.useEffect(() => {
    editData?.telephone && setTelValue(editData?.telephone);
  }, [editData?.telephone]);

  const handleChange = (event) => {
    const newValue = event.target.value.replace(/\D/g, '').slice(0, 10); // Remove non-numeric characters and limit to 10 digits
    setTelValue(newValue);
  };
  const handleNidChange = (event) => {
    const newValue = event.target.value.replace(/\D/g, '').slice(0, 16); // Remove non-numeric characters and limit to 10 digits
    setNidValue(newValue);
  };
  const [loading, setLoading] = React.useState(false);
  function generatePassword(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }
  
  function generateUniquePasswords(numPasswords, length) {
    const passwords = new Set();
    while (passwords.size < numPasswords) {
      const password = generatePassword(length);
      passwords.add(password);
    }
    return Array.from(passwords);
  }
  
  const numPasswords = 5;
  const passwordLength = 8;
  const uniquePasswords = generateUniquePasswords(1, 5);
  console.log(uniquePasswords);
  
  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        New member
      </Button>
      <Dialog
        open={open || editmember}
        onClose={handleClose}
        // fullScreen={true}
        PaperProps={{
          component: 'form',
          onSubmit: async (event) => {
            event.preventDefault();
            setLoading(true);
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const names = formJson.names;
            const sector = formJson.sector;
            const cell = formJson.cell;
            const village = formJson.village;
            // Query Firestore to get the document
            const querySnapshot = await getDocs(query(membersDb, where('nid', '==', parseInt(nidValue)),where('telephone', '==', parseInt(telValue))));
            if (editmember) {
              const data = {
                names,
                telephone: parseInt(telValue),
                nid: parseInt(nidValue),
                sector,
                cell,
                village,
                role:editData?.role
              };
              await updateDoc(doc(membersDb, querySnapshot.docs[0].id), data);
              getMembers();
              setLoading(false);
              handleClose();
            } else {
              if (querySnapshot.empty) {
                const ind = 12;
                const iterableArray = Array.from({ length: ind }, (_, index) => index + 1);
                const guturajson = {
                  year: 2024,
                  nid: parseInt(nidValue),
                  total:0
                };

                iterableArray.forEach((id) => {
                  guturajson[`month${id}`] = 0
                });
                const gutirajson = {
                  year: 2024,
                  nid:parseInt(nidValue),
                  sharedebt: 0
                };

                iterableArray.forEach((id) => {
                  gutirajson[`month${id}`] = {
                    loan: 0,
                    interest: 0,
                    loanwithintereset: 0,
                    paid: 0,
                    debt: 0,
                    prevdebt: 0
                  };
                });
                const kuguzajson = {
                  year: 2024,
                  nid: parseInt(nidValue),
                  sharedebt: 0
                };

                iterableArray.forEach((id) => {
                  kuguzajson[`month${id}`] = {
                    loan: 0,
                    interest: 0,
                    loanwithintereset: 0,
                    paid: 0,
                    debt: 0,
                    prevdebt: 0
                  };
                });
                const data = {
                  names,
                  telephone: parseInt(telValue),
                  nid: parseInt(nidValue),
                  sector,
                  cell,
                  village,
                  role:0
                };
                await addDoc(membersDb, data);
                await addDoc(kuguzaDb, kuguzajson);
                await addDoc(gutiraDb, gutirajson);
                await addDoc(guturaDb, guturajson);
                getMembers();
                setLoading(false);
                handleClose();
              } else {
                setRoor('user already exits');
                setLoading(false);
              }
            }
          }
        }}
      >
        <DialogTitle sx={{ my: 0.5, fontSize: '1.875rem' }}>{editmember ? 'Hindura Amakuru' : 'New member'}</DialogTitle>
        <DialogContent sx={{ width: '700px' }}>
          <TextField
            autoFocus
            required
            margin="dense"
            id="names"
            name="names"
            label="Amazina"
            type="text"
            fullWidth
            variant="outlined"
            defaultValue={editData?.names}
            InputLabelProps={{ shrink: true, style: { fontSize: '1.2rem' } }}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="telephone"
            name="telephone"
            value={telValue}
            onChange={handleChange}
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*',
              maxLength: 10
            }}
            label="Telephone"
            sx={{ my: 2 }}
            defaultValue={editmember && editData?.telephone}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true, style: { fontSize: '1.2rem' } }}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="nid"
            // name="nid"
            value={nidValue}
            onChange={handleNidChange}
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*',
              maxLength: 16
            }}
            label="Indangamuntu"
            sx={{ mb: 2 }}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true, style: { fontSize: '1.2rem' } }}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="sector"
            label="Umurenge"
            type="text"
            fullWidth
            variant="outlined"
            defaultValue={editData?.sector}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true, style: { fontSize: '1.2rem' } }}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="cell"
            label="Umudugudu"
            type="text"
            fullWidth
            variant="outlined"
            defaultValue={editData?.cell}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true, style: { fontSize: '1.2rem' } }}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="village"
            label="Akagari"
            type="text"
            fullWidth
            variant="outlined"
            defaultValue={editData?.village}
            InputLabelProps={{ shrink: true, style: { fontSize: '1.2rem' } }}
          />
        </DialogContent>
        {error && (
          <Box sx={{ mx: 'auto', textAlign: 'center', backgroundColor: 'red', color: 'white', padding: '10px', fontSize: '15px' }}>
            Umunyamuryango asanzwemo
          </Box>
        )}
        <DialogActions sx={{ mx: 'auto', my: 3 }}>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit">{editmember ? 'Update' : 'Save'}</Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
export default FormDialog;
