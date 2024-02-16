import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { Box, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

// third-party
import NumberFormat from 'react-number-format';

// project import
import Dot from 'components/@extended/Dot';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress } from '../../../node_modules/@mui/material/index';
import { gutiraFromfir } from 'store/reducers/menu';
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

// ==============================|| ORDER TABLE - HEADER ||============================== //

// ==============================|| ORDER TABLE - STATUS ||============================== //

const OrderStatus = ({ status }) => {
  let color;
  let title;

  switch (status) {
    case 0:
      color = 'warning';
      title = 'Pending';
      break;
    case 1:
      color = 'success';
      title = 'Approved';
      break;
    case 2:
      color = 'error';
      title = 'Rejected';
      break;
    default:
      color = 'primary';
      title = 'None';
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
};

OrderStatus.propTypes = {
  status: PropTypes.number
};

// ==============================|| ORDER TABLE ||============================== //

const gutiraDb = collection(database, 'gutira');
export default function OrderTable() {
  const [order] = useState('asc');
  const [orderBy] = useState('trackingNo');
  const [selected] = useState([]);

  const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;
  const { gutiradata } = useSelector((state) => state.menu);
  const { selectedmonth } = useSelector((state) => state.menu);
  const [pre, setPre] = useState(null);
  let premonth = 0;
  useEffect(() => {
    if (selectedmonth.length > 0) {
      premonth = selectedmonth.match(/\d+$/)[0];
    }

    if (selectedmonth.match(/\bmonth1\b/)) {
      setPre(null);
    } else {
      setPre(`month${premonth - 1}`);
    }
  }, [selectedmonth]);
  const headCells = [
    {
      id: 'amazina',
      align: 'left',
      disablePadding: false,
      label: 'Amazina'
    }
  ];

  if (!selectedmonth.match(/\bmonth1\b/)) {
    headCells.push({
      id: 'ukwezi01',
      align: 'left',
      disablePadding: true,
      label: 'Ideni afitemo'
    });
  }

  headCells.push(
    {
      id: 'ukwezi1',
      align: 'left',
      disablePadding: true,
      label: 'Ayo yagujije'
    },
    {
      id: 'ukwezi2',
      align: 'left',
      disablePadding: true,
      label: 'Inyungu 5% na 7% izakurikizwa'
    },
    {
      id: 'ukwezi3',
      align: 'left',
      disablePadding: true,
      label: 'Ayo yagombye kwishyura'
    },
    {
      id: 'ukwezi4',
      align: 'left',
      disablePadding: true,
      label: 'Ayo yishyuye'
    },
    {
      id: 'ukwezi5',
      align: 'left',
      disablePadding: true,
      label: 'Ayasigaye'
    }
  );
  function OrderTableHead({ order, orderBy }) {
    return (
      <TableHead>
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
  const { membersdata } = useSelector((state) => state.menu);
  OrderTableHead.propTypes = {
    order: PropTypes.string,
    orderBy: PropTypes.string
  };
  function searchNameOrId(targetValue) {
    for (let i = 0; i < membersdata.length; i++) {
      if (membersdata[i].nid === targetValue) {
        return membersdata[i].names;
      }
    }
  }
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
          {membersdata?.length > 0 ? (
            <TableBody>
              {gutiradata?.map((row, index) => {
                const isItemSelected = isSelected(row.trackingNo);
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.nid}
                    selected={isItemSelected}
                  >
                    <TableCell component="th" id={labelId} scope="row" align="left">
                      <Link color="secondary" component={RouterLink} to="">
                        {searchNameOrId(row?.nid)?.charAt(0).toUpperCase() + searchNameOrId(row?.nid).slice(1)}
                      </Link>
                    </TableCell>
                    {pre && (
                      <TableCell align="left">
                        <NumberFormat value={row[selectedmonth]?.prevdebt?.toFixed()} displayType="text" thousandSeparator prefix="Frw " />
                      </TableCell>
                    )}
                    <TableCell align="left">
                      <NumberFormat value={row[selectedmonth]?.loan?.toFixed()} displayType="text" thousandSeparator prefix="Frw " />
                    </TableCell>
                    <TableCell align="left">
                      <NumberFormat
                        value={(row[selectedmonth]?.loanwithintereset + row[selectedmonth]?.paid - row[selectedmonth]?.loan)?.toFixed()}
                        displayType="text"
                        thousandSeparator
                        prefix="Frw "
                      />
                    </TableCell>
                    <TableCell align="left">
                      <NumberFormat
                        value={(row[selectedmonth]?.loanwithintereset + row[selectedmonth]?.paid)?.toFixed()}
                        displayType="text"
                        thousandSeparator
                        prefix="Frw "
                      />
                    </TableCell>
                    <TableCell align="left">
                      <NumberFormat value={row[selectedmonth]?.paid?.toFixed()} displayType="text" thousandSeparator prefix="Frw " />
                    </TableCell>
                    <TableCell align="left">
                      <NumberFormat
                        value={row[selectedmonth]?.loanwithintereset?.toFixed()}
                        displayType="text"
                        thousandSeparator
                        prefix="Frw "
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          ) : (
            <TableRow>
              <TableCell align="center" colSpan={14}>
                {' '}
                {/* Adjust the colspan according to your table structure */}
                <CircularProgress />
              </TableCell>
            </TableRow>
          )}
        </Table>
      </TableContainer>
    </Box>
  );
}
