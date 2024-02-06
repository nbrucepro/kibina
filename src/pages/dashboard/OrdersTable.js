import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { Box, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

// third-party
import NumberFormat from 'react-number-format';
import { database } from 'config/direabse.config';
import { collection,
    // getDoc,
    getDocs,
    query,
    where, } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { guturaFromfir } from 'store/reducers/menu';

const guturaDb = collection(database, 'gutura');

// function createData(
//   amazina,
//   ukwezi1,
//   ukwezi2,
//   ukwezi3,
//   ukwezi4,
//   ukwezi5,
//   ukwezi6,
//   ukwezi7,
//   ukwezi8,
//   ukwezi9,
//   ukwezi10,
//   ukwezi11,
//   ukwezi12
// ) {
//   return { amazina, ukwezi1, ukwezi2, ukwezi3, ukwezi4, ukwezi5, ukwezi6, ukwezi7, ukwezi8, ukwezi9, ukwezi10, ukwezi11, ukwezi12 };
// }

// const rows = [createData('John kamali', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)];

// function descendingComparator(a, b, orderBy) {
//   if (b[orderBy] < a[orderBy]) {
//     return -1;
//   }
//   if (b[orderBy] > a[orderBy]) {
//     return 1;
//   }
//   return 0;
// }

// function getComparator(order, orderBy) {
//   return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
// }

// function stableSort(array, comparator) {
//   const stabilizedThis = array?.map((el, index) => [el, index]);
//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) {
//       return order;
//     }
//     return a[1] - b[1];
//   });
//   return stabilizedThis.map((el) => el[0]);
// }
// function addMonet() {
//   return rows[0].ukwezi9;
// }
// ==============================|| ORDER TABLE - HEADER CELL ||============================== //

const headCells = [
  {
    id: 'amazina',
    align: 'left',
    disablePadding: false,
    label: 'Amazina'
  },
  {
    id: 'ukwezi1',
    align: 'left',
    disablePadding: true,
    label: 'Ukwezi 1'
  },
  {
    id: 'ukwezi2',
    align: 'left',
    disablePadding: true,
    label: 'Ukwezi 2'
  },
  {
    id: 'ukwezi3',
    align: 'left',
    disablePadding: true,
    label: 'Ukwezi 3'
  },
  {
    id: 'ukwezi4',
    align: 'left',
    disablePadding: true,
    label: 'Ukwezi 4'
  },
  {
    id: 'ukwezi5',
    align: 'left',
    disablePadding: true,
    label: 'Ukwezi 5'
  },
  {
    id: 'ukwezi6',
    align: 'left',
    disablePadding: true,
    label: 'Ukwezi 6'
  },
  {
    id: 'ukwezi7',
    align: 'left',
    disablePadding: true,
    label: 'Ukwezi 7'
  },
  {
    id: 'ukwezi8',
    align: 'left',
    disablePadding: true,
    label: 'Ukwezi 8'
  },
  {
    id: 'ukwezi9',
    align: 'left',
    disablePadding: true,
    label: 'Ukwezi 9'
  },
  {
    id: 'ukwezi10',
    align: 'left',
    disablePadding: true,
    label: 'Ukwezi 10'
  },
  {
    id: 'ukwezi11',
    align: 'left',
    disablePadding: true,
    label: 'Ukwezi 11'
  },
  {
    id: 'ukwezi12',
    align: 'left',
    disablePadding: true,
    label: 'Ukwezi 12'
  },
  {
    id: 'protein',
    align: 'right',
    disablePadding: false,
    label: 'Yose hamwe'
  }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

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
  const dispatch = useDispatch()
  const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;
  const getGutura = async()=>{
    const q = query(guturaDb, where("usernames", "==", "John Kamali"));
    const ridesSnapshot = await getDocs(q);
    const ridesData = []
    if(ridesSnapshot?.docs?.length > 0){
      ridesData.push(ridesSnapshot?.docs[0]?.data())
    }
    // console.log(ridesData)
    dispatch(guturaFromfir(ridesData))
  }
useEffect(()=>{
  getGutura()
  // retudata()
},[])
const {guturadata} = useSelector((state) => state.menu);
console.log(guturadata)
// let rows1 = []
// const retudata = () => {
//   if (Array.isArray(guturaDb)) {
//     rows1 = guturaDb.map(data => createData(data?.usernames,data?.month1,data?.month2,data?.month3,data?.month4,data?.month5));
//   }
// };

// const rows1 = [createData('John kamali', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)];
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
          <TableBody>
            {guturadata.map((row, index) => {
            // {stableSort(guturadata, getComparator(order, orderBy)).map((row, index) => {
              const isItemSelected = isSelected(row.trackingNo);
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.usernames}
                  selected={isItemSelected}
                >
                  <TableCell component="th" id={labelId} scope="row" align="left">
                    <Link color="secondary" component={RouterLink} to="">
                      {row.usernames}
                    </Link>
                  </TableCell>
                  <TableCell align="left">
                    <NumberFormat value={row.month1} displayType="text" thousandSeparator prefix="Frw " />
                  </TableCell>
                  <TableCell align="left">
                    <NumberFormat value={row.month2} displayType="text" thousandSeparator prefix="Frw " />
                  </TableCell>
                  <TableCell align="left">
                    <NumberFormat value={row.month3} displayType="text" thousandSeparator prefix="Frw " />
                  </TableCell>
                  <TableCell align="left">
                    <NumberFormat value={row.month4} displayType="text" thousandSeparator prefix="Frw " />
                  </TableCell>
                  <TableCell align="left">
                    <NumberFormat value={row.month5} displayType="text" thousandSeparator prefix="Frw " />
                  </TableCell>
                  <TableCell align="left">
                    <NumberFormat value={row.month6} displayType="text" thousandSeparator prefix="Frw " />
                  </TableCell>
                  <TableCell align="left">
                    <NumberFormat value={row.month7} displayType="text" thousandSeparator prefix="Frw " />
                  </TableCell>
                  <TableCell align="left">
                    <NumberFormat value={row.month8} displayType="text" thousandSeparator prefix="Frw " />
                  </TableCell>
                  <TableCell align="left">
                    <NumberFormat value={row.month9} displayType="text" thousandSeparator prefix="Frw " />
                  </TableCell>
                  <TableCell align="left">
                    <NumberFormat value={row.month10} displayType="text" thousandSeparator prefix="Frw " />
                  </TableCell>
                  <TableCell align="left">
                    <NumberFormat value={row.month11} displayType="text" thousandSeparator prefix="Frw " />
                  </TableCell>
                  <TableCell align="left">
                    <NumberFormat value={row.month12} displayType="text" thousandSeparator prefix="Frw " />
                  </TableCell>
                  <TableCell align="right">
                    <NumberFormat value={row.total} displayType="text" thousandSeparator prefix="Frw " />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
