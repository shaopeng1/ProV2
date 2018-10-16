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