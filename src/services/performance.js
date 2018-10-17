import { stringify } from 'qs';
import request from '@/utils/request';



//对象类型变化时获取数据
export async function changeNeTypeNew(params) {
  return request('/api/changeNeTypeNew',{
    method: 'POST',
    body: params,
  });
}


//点击交换获取交换下基站
export async function changeObj(params) {
  return request('/api/changeObj',{
    method: 'POST',
    body: params,
  });
}


//通话组联想
export async function getGSSIList(params) {
  return request('/api/getGSSIList',{
    method: 'POST',
    body: params,
  });
}


//用户联想
export async function getISSIList(params) {
  return request('/api/getISSIList',{
    method: 'POST',
    body: params,
  });
}


//获取查询列表数据
export async function getDataReport(params) {
  return request('/api/getDataReport',{
    method: 'POST',
    body: params,
  });
}

