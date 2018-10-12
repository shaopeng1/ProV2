import { fakeChartData,changeType,bSranking, } from '@/services/api';

export default {
  namespace: 'chart',

  state: {
    BSData: [],//交换列表
    visitData: [],
    visitData2: [],
    salesData: [],//销售额数据
    searchData: [],
    rankingListData: [],//门店销售额排名
    offlineData: [],
    offlineChartData: [],
    salesTypeData: [],
    salesTypeDataOnline: [],
    salesTypeDataOffline: [],
    radarData: [],
    loading: false,
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(fakeChartData);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchSalesData(_, { call, put }) {
      const response = yield call(fakeChartData);
      yield put({
        type: 'save',
        payload: {
          salesData: response.salesData,
        },
      });
    },
    *bSranking({ payload, callback }, { call, put }) {
      const response = yield call(bSranking, payload);
      /*let res = JSON.parse(response);
      yield put({
        type: 'save',
        payload: {
          salesData: res.XY,
          rankingListData: res.rankingListData,
        },
      });*/
      if (callback) callback();
    },

  /*  *bSranking(payload, { call, put }) {
      const response = yield call(bSranking);
      let res = JSON.parse(response);
      yield put({
        type: 'save',
        payload:response,
      });
    },*/
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return {
        BSData: [],//交换列表
        visitData: [],
        visitData2: [],
        rankingListData: [],//门店销售额排名
        salesData: [],//销售额数据
        searchData: [],
        offlineData: [],
        offlineChartData: [],
        salesTypeData: [],
        salesTypeDataOnline: [],
        salesTypeDataOffline: [],
        radarData: [],
      };
    },
  },
};
