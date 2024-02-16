// project import
import Routes from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import { useDispatch } from 'react-redux';
import { guturaFromfir, membersFromfir } from 'store/reducers/menu';
import { useEffect } from 'react';
import { query, getDocs,collection,where } from 'firebase/firestore';
import { database,  } from 'config/direabse.config';
// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const membersDb = collection(database, 'members');
const guturaDb = collection(database, 'gutura');
const App = () => {
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
    dispatch(guturaFromfir(ridesData));
  };
  const getMembers = async () => {
    const q = query(membersDb);
    const ridesSnapshot = await getDocs(q);
    const ridesData = [];
    for (const members of ridesSnapshot?.docs) {
      ridesData.push({ ...members.data() });
    }
    dispatch(membersFromfir(ridesData));
  };
  useEffect(() => {
    getMembers();
    getGutura();
  }, []);
  return (
    <ThemeCustomization>
      <ScrollTop>
        <Routes />
      </ScrollTop>
    </ThemeCustomization>
  );
};

export default App;
