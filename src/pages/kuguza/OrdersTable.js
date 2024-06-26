import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { Box, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

// third-party
import NumberFormat from 'react-number-format';

// project import
import Dot from 'components/@extended/Dot';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress } from '../../../node_modules/@mui/material/index';
import { kuguzaFromfir } from 'store/reducers/menu';
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
import { database } from 'config/direabse.config';

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

const kuguzaDb = collection(database, 'kuguza');
const sreportDb = collection(database, 'sreport');
export default function OrderTable() {
  const [order] = useState('asc');
  const [orderBy] = useState('trackingNo');
  const [selected] = useState([]);

  const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;
  const { kuguzadata } = useSelector((state) => state.menu);
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
      label: 'Inyungu 3% izakurikizwa'
    },
    // {
    //   id: 'ukwezi3',
    //   align: 'left',
    //   disablePadding: true,
    //   label: 'Ayo yagombye kwishyura'
    // },
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
  const getKuguza = async () => {
    const q = loggedInusersm?.role === 0 ? query(kuguzaDb, where('nid', '==', loggedInusersm?.nid)) : query(kuguzaDb);
    const ridesSnapshot = await getDocs(q);
    const ridesData = [];
    for (const members of ridesSnapshot?.docs) {
      ridesData.push({ ...members.data() });
    }
    dispatch(kuguzaFromfir(ridesData));
  };
  useEffect(() => {
    getKuguza();
  }, []);
  const arrayOfArrays = [];

  for (let i = 0; i < 3; i++) {
    arrayOfArrays.push([]);
  }
  const previousTotal = useRef(0);
  const previousTotal2 = useRef(0);
  const previousTotal3 = useRef(0);
  const updateCuturatotal = async (total,total2,total3) => {
    const querySnapshot2 = await getDocs(query(sreportDb));

    await updateDoc(doc(sreportDb, querySnapshot2.docs[0].id), {
      ayagujijweTotal: total,
      ayishyuweKuguza: total2,
      kuguzaDebt: total3,
    });
  };
  useEffect(() => {
    const total = arrayOfArrays[0].reduce((acc, cur) => acc + cur, 0);
    const total2 = arrayOfArrays[1].reduce((acc, cur) => acc + cur, 0);
    const total3 = arrayOfArrays[2].reduce((acc, cur) => acc + cur, 0);
    if (total !== previousTotal.current || total === 0) {
      updateCuturatotal(total,total2,total3);
      previousTotal.current = total; 
      previousTotal2.current = total2; 
      previousTotal3.current = total3; 
    }
  }, [arrayOfArrays, kuguzadata]);
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
          {members?.length > 0 ? (
            <TableBody>
              {kuguzadata?.map((row, index) => {
                const isItemSelected = isSelected(row.trackingNo);
                const labelId = `enhanced-table-checkbox-${index}`;
                for (let i = 1; i <= 12; i++) {
                  const mfmf = row[`month${i}`]?.debt +  row[`month${i}`]?.interest;
                  arrayOfArrays[0].push(row[`month${i}`]?.loan);
                  arrayOfArrays[1].push(row[`month${i}`]?.paid);
                  arrayOfArrays[2].push(mfmf);
                }
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
                      {/* <NumberFormat
                        value={(row[selectedmonth]?.loanwithintereset + row[selectedmonth]?.paid - row[selectedmonth]?.loan)?.toFixed()}
                        displayType="text"
                        thousandSeparator
                        prefix="Frw "
                      /> */}
                      <NumberFormat
                        value={(row[selectedmonth]?.interest)?.toFixed()}
                        displayType="text"
                        thousandSeparator
                        prefix="Frw "
                      />
                    </TableCell>
                    {/* <TableCell align="left">
                      <NumberFormat
                        value={(row[selectedmonth]?.loanwithintereset + row[selectedmonth]?.paid)?.toFixed()}
                        displayType="text"
                        thousandSeparator
                        prefix="Frw "
                      />
                        </TableCell> */}
                      {/* <NumberFormat
                        value={(row[selectedmonth]?.loanwithintereset)?.toFixed()}
                        displayType="text"
                        thousandSeparator
                        prefix="Frw "
                      /> */}
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
