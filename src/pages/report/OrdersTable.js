import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { Box, Link, Table, TableFooter, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

// third-party
import NumberFormat from 'react-number-format';
import { database } from 'config/direabse.config';
import {
  collection,
  // getDoc,
  getDocs,
  query,
  where
} from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { guturaFromfir } from 'store/reducers/menu';
import { CircularProgress } from '../../../node_modules/@mui/material/index';

const guturaDb = collection(database, 'gutura');

const headCells = [
  {
    id: 'ayatuwe',
    align: 'left',
    disablePadding: false,
    label: 'Ayatuwe'
  },
  {
    id: 'angoboka',
    align: 'left',
    disablePadding: false,
    label: 'Ingoboka'
  },
  {
    id: 'ayagujijwe',
    align: 'left',
    disablePadding: true,
    label: 'Ayagujijwe'
  },
  {
    id: 'ayatiriwe',
    align: 'left',
    disablePadding: false,
    label: 'Ayatiriwe'
  },
  {
    id: 'ayishyuwe1',
    align: 'left',
    disablePadding: true,
    label: 'Ayishyuwe kuguza + inyungu'
  },
  {
    id: 'ayishyuwe2',
    align: 'left',
    disablePadding: true,
    label: 'Ayishyuwe gutira + inyungu'
  },
  {
    id: 'atariyishurwa1',
    align: 'left',
    disablePadding: true,
    label: 'Atari yishyurwa-kuguza'
  },
  {
    id: 'atariyishurwa2',
    align: 'left',
    disablePadding: true,
    label: 'Atari yishyurwa-gutira'
  },
  {
    id: 'protein',
    align: 'right',
    disablePadding: false,
    label: 'Ayo dufite'
  }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

function OrderTableHead({ order, orderBy }) {
  return (
    <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

OrderTableHead.propTypes = {
  order: PropTypes.string,
  orderBy: PropTypes.string
};

// ==============================|| ORDER TABLE - STATUS ||============================== //

// ==============================|| ORDER TABLE ||============================== //

export default function OrderTable() {
  const [order] = useState('asc');
  const [orderBy] = useState('amazina');
  const [selected] = useState([]);
  const dispatch = useDispatch();
  const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;
  const usersmString = localStorage.getItem('userm');
  const loggedInusersm = usersmString ? JSON.parse(usersmString) : null;
  const getGutura = async () => {
    const q = loggedInusersm?.role === 0 ? query(guturaDb, where('nid', '==', loggedInusersm?.nid)) : query(guturaDb);
    const ridesSnapshot = await getDocs(q);
    const ridesData = [];
    for (const members of ridesSnapshot?.docs) {
      ridesData.push({ ...members.data() });
    }
    dispatch(guturaFromfir(ridesData));
  };
  useEffect(() => {
    getGutura();
    // retudata()
  }, []);
  const { guturadata } = useSelector((state) => state.menu);
  const [members, setMembers] = useState([]);
  const membersDb = collection(database, 'members');
  const getmebers = async () => {
    const q = query(membersDb);
    const ridesSnapshot = await getDocs(q);
    const ridesData = [];
    for (const members of ridesSnapshot?.docs) {
      ridesData.push({ ...members.data() });
    }
    setMembers(ridesData);
  };
  useEffect(() => {
    getmebers();
  }, []);

  function searchNameOrId(targetValue) {
    for (let i = 0; i < members.length; i++) {
      if (members[i].nid === targetValue) {
        return members[i].names;
      }
    }
  }
  const arrayOfArrays = [];

  // Loop to create 12 empty arrays
  for (let i = 0; i <= 12; i++) {
    arrayOfArrays.push([]);
  }
  const { sreportData } = useSelector((state) => state.menu);
  // console.log('sreportData', sreportData);
  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          sx={{
            '& .MuiTableCell-root:first-of-type': {
              pl: 2
            },
            '& .MuiTableCell-root:last-of-type': {
              pr: 3
            }
          }}
        >
          <OrderTableHead order={order} orderBy={orderBy} />
          {sreportData?.length > 0 ? (
            <TableBody>
              {sreportData.map((row, index) => {
                // {stableSort(guturadata, getComparator(order, orderBy)).map((row, index) => {
                const isItemSelected = isSelected(row.trackingNo);
                const labelId = `enhanced-table-checkbox-${index}`;
                const whatwehave =
                  row?.guturaTotal +
                  row?.ingobokaTotal -
                  (row?.ayagujijweTotal + row?.ayatiriweTotal) +
                  (row?.ayishyuweKuguza + row?.ayishyuweGutira);
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row?.nid}
                    selected={isItemSelected}
                  >
                    <TableCell align="left">
                      <NumberFormat value={row?.guturaTotal} displayType="text" thousandSeparator prefix="Frw " />
                    </TableCell>
                    <TableCell align="left">
                      <NumberFormat value={row?.ingobokaTotal} displayType="text" thousandSeparator prefix="Frw " />
                    </TableCell>
                    <TableCell align="left">
                      <NumberFormat value={row?.ayagujijweTotal} displayType="text" thousandSeparator prefix="Frw " />
                    </TableCell>
                    <TableCell align="left">
                      <NumberFormat value={row?.ayatiriweTotal} displayType="text" thousandSeparator prefix="Frw " />
                    </TableCell>
                    <TableCell align="left">
                      <NumberFormat value={row?.ayishyuweKuguza} displayType="text" thousandSeparator prefix="Frw " />
                    </TableCell>
                    <TableCell align="left">
                      <NumberFormat value={row?.ayishyuweGutira} displayType="text" thousandSeparator prefix="Frw " />
                    </TableCell>
                    <TableCell align="left">
                      <NumberFormat
                        value={(row?.ayishyuweKuguza-(row?.ayagujijweTotal + row?.kuguzaDept) > 0 ? 0 : row?.ayishyuweKuguza-(row?.ayagujijweTotal + row?.kuguzaDept))}
                        displayType="text"
                        thousandSeparator
                        prefix="Frw "
                      />
                    </TableCell>
                    <TableCell align="left">
                      <NumberFormat value={(row?.ayishyuweGutira-(row?.ayatiriweTotal + row?.gutiraDept) > 0 ? 0 : row?.ayishyuweGutira-(row?.ayatiriweTotal + row?.gutiraDept))} displayType="text" thousandSeparator prefix="Frw " />
                    </TableCell>
                    <TableCell align="right">
                      <NumberFormat value={whatwehave} displayType="text" thousandSeparator prefix="Frw " />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          ) : (
            <TableRow>
              <TableCell align="center" colSpan={14}>
                {' '}
                <CircularProgress />
              </TableCell>
            </TableRow>
          )}
        </Table>
      </TableContainer>
    </Box>
  );
}
