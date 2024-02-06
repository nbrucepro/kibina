// types
import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
  openItem: ['dashboard'],
  defaultId: 'dashboard',
  openComponent: 'buttons',
  drawerOpen: false,
  componentDrawerOpen: true,
  guturadata:[],
  kuguzadata:[],
  gutiradata:[],
  selectedmonth:""
};

// ==============================|| SLICE - MENU ||============================== //

const menu = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    activeItem(state, action) {
      state.openItem = action.payload.openItem;
    },

    activeComponent(state, action) {
      state.openComponent = action.payload.openComponent;
    },

    openDrawer(state, action) {
      state.drawerOpen = action.payload.drawerOpen;
    },

    openComponentDrawer(state, action) {
      state.componentDrawerOpen = action.payload.componentDrawerOpen;
    },
    guturaFromfir(state,action){
      state.guturadata = action.payload
    },
    kuguzaFromfir(state,action){
      state.kuguzadata = action.payload
    },
    gutiraFromfir(state,action){
      state.gutiradata = action.payload
    },
    setselectedmonth(state,action){
      state.selectedmonth = action.payload
    }
  }
});

export default menu.reducer;

export const {setselectedmonth, activeItem, activeComponent, openDrawer, openComponentDrawer,guturaFromfir,kuguzaFromfir,gutiraFromfir } = menu.actions;
