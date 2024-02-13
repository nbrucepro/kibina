import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { Button, Box, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

// third-party
import NumberFormat from 'react-number-format';

// project import
import Dot from 'components/@extended/Dot';
import { useDispatch, useSelector } from 'react-redux';
import { toggleModals } from 'store/reducers/menu';

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

export default function OrderTable() {
  const [order] = useState('asc');
  const [orderBy] = useState('trackingNo');
  const [selected] = useState([]);
  const dispatch = useDispatch();
  const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;
  const { membersdata } = useSelector((state) => state.menu);
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
      id: 'tel',
      align: 'left',
      disablePadding: true,
      label: 'Telephone'
    },
    {
      id: 'nid',
      align: 'left',
      disablePadding: true,
      label: 'Indangamuntu'
    },
    {
      id: 'location1',
      align: 'left',
      disablePadding: true,
      label: 'Umurenge'
    },
    {
      id: 'location2',
      align: 'left',
      disablePadding: true,
      label: 'Akagari'
    },
    {
      id: 'location3',
      align: 'left',
      disablePadding: true,
      label: 'Umudugudu'
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

  OrderTableHead.propTypes = {
    order: PropTypes.string,
    orderBy: PropTypes.string
  };
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
            {membersdata?.map((row, index) => {
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
                  key={row.names}
                  selected={isItemSelected}
                >
                  <TableCell component="th" id={labelId} scope="row" align="left">
                    <Link color="secondary" component={RouterLink} to="">
                      {row.names}
                    </Link>
                  </TableCell>
                  <TableCell align="left">
                    <NumberFormat value={row?.telephone} displayType="text" prefix='0'/>
                  </TableCell>
                  <TableCell align="left">{row?.nid}</TableCell>
                  <TableCell align="left">{row?.sector}</TableCell>
                  <TableCell align="left">{row?.cell}</TableCell>
                  <TableCell align="left">{row?.village}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      onClick={() => {
                        dispatch(toggleModals({ editmember: true,editData:row }));
                      }}
                    >
                      Hindura amakuru
                    </Button>
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
