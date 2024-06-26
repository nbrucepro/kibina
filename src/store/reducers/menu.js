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
  ingobokadata:[],
  kuguzadata:[],
  gutiradata:[],
  membersdata:[],
  sreportData:[],
  expensesData:[],
  penalitiesData:[],
  selectedmonth:"",
  modals:{
    li: false
  }
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
    ingobokaFromfir(state,action){
      state.ingobokadata = action.payload
    },
    kuguzaFromfir(state,action){
      state.kuguzadata = action.payload
    },
    gutiraFromfir(state,action){
      state.gutiradata = action.payload
    },
    membersFromfir(state,action){
      state.membersdata = action.payload
    },
    setselectedmonth(state,action){
      state.selectedmonth = action.payload
    },
    toggleModals: (state, action) => {
      state.modals = action.payload;
    },
    sreportFromfir: (state, action) => {
      state.sreportData = action.payload;
    },
    expensesFromfir: (state, action) => {
      state.expensesData = action.payload;
    },
    penalitiesFromfir: (state, action) => {
      state.penalitiesData = action.payload;
    },
  }
});

export default menu.reducer;

export const {setselectedmonth, activeItem, activeComponent, 
  openDrawer, openComponentDrawer,guturaFromfir,kuguzaFromfir,
  gutiraFromfir,membersFromfir,toggleModals,sreportFromfir,ingobokaFromfir,expensesFromfir,penalitiesFromfir } = menu.actions;
