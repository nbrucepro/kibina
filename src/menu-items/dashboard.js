// assets
import { DashboardOutlined, ChromeOutlined, UserOutlined,ReadOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  ChromeOutlined,
  UserOutlined,
  ReadOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const usersmString = localStorage.getItem('userm');
const loggedInusersm = usersmString ? JSON.parse(usersmString) : null;
const dashboard = {
  id: 'group-dashboard',
  title: '',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Gutura',
      type: 'item',
      url: '/app/gutura',
      icon: icons.DashboardOutlined
      // breadcrumbs: false
    },
    {
      id: 'imigabane',
      title: 'Imigabane',
      type: 'item',
      url: '/app/imigabane',
      icon: icons.DashboardOutlined
      // breadcrumbs: false
    },
    {
      id: 'ingoboka',
      title: 'Ingoboka',
      type: 'item',
      url: '/app/ingoboka',
      icon: icons.DashboardOutlined
      // breadcrumbs: false
    },
    // {
    //   id: 'Kuguza',
    //   title: 'Kuguza',
    //   type: 'item',
    //   url: '/app/kuguza',
    //   icon: icons.ChromeOutlined
    // },
    // {
    //   id: 'Gutira',
    //   title: 'Gutira',
    //   type: 'item',
    //   url: '/app/gutira',
    //   icon: icons.ChromeOutlined
    // }
  ]
};
{
  loggedInusersm?.role === 1 &&
    dashboard.children.push(
      {
        id: 'users',
        title: 'Members',
        type: 'item',
        url: '/app/members',
        icon: icons.UserOutlined
      },
      // {
      //   id: 'report',
      //   title: 'Raport ngufi',
      //   type: 'item',
      //   url: '/app/shortreport',
      //   icon: icons.ReadOutlined
      // }
    );
}
export default dashboard;
