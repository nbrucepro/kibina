// assets
import { DashboardOutlined, ChromeOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  ChromeOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: '',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Gutura',
      type: 'item',
      url: '/',
      icon: icons.DashboardOutlined
      // breadcrumbs: false
    },
    {
      id: 'Kuguza',
      title: 'Kuguza',
      type: 'item',
      url: '/kuguza',
      icon: icons.ChromeOutlined
    },
    {
      id: 'Gutira',
      title: 'Gutira',
      type: 'item',
      url: '/gutira',
      icon: icons.ChromeOutlined
    }
  ]
};

export default dashboard;
