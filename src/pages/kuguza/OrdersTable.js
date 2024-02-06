import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { Box, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

// third-party
import NumberFormat from 'react-number-format';

// project import
import Dot from 'components/@extended/Dot';
import { useSelector } from 'react-redux';


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
    label: 'Ayo yagujije'
  },
  {
    id: 'ukwezi2',
    align: 'left',
    disablePadding: true,
    label: 'Inyungu 3%'
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

export default function OrderTable() {
  const [order] = useState('asc');
  const [orderBy] = useState('trackingNo');
  const [selected] = useState([]);

  const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;
  const {kuguzadata} = useSelector((state) => state.menu);

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
            {kuguzadata?.map((row, index) => {
            // {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
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
                    <NumberFormat value={row.loan} displayType="text" thousandSeparator prefix="Frw " />
                  </TableCell>
                  <TableCell align="left">
                    <NumberFormat value={row.interest} displayType="text" thousandSeparator prefix="Frw " />
                  </TableCell>
                  <TableCell align="left">
                    <NumberFormat value={row.loanwithintereset} displayType="text" thousandSeparator prefix="Frw " />
                  </TableCell>
                  <TableCell align="left">
                    <NumberFormat value={row.paid} displayType="text" thousandSeparator prefix="Frw " />
                  </TableCell>
                  <TableCell align="left">
                    <NumberFormat value={row.loanwithintereset} displayType="text" thousandSeparator prefix="Frw " />
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
