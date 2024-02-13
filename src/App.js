// project import
import Routes from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import { useDispatch } from 'react-redux';
import { membersFromfir } from 'store/reducers/menu';
import { useEffect } from 'react';
import { query, getDocs,collection } from 'firebase/firestore';
import { database,  } from 'config/direabse.config';
// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const membersDb = collection(database, 'members');
const App = () => {
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
  useEffect(() => {
    getMembers();
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
