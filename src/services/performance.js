import { stringify } from 'qs';
import request from '@/utils/request';



//对象类型变化时获取数据
export async function changeNeTypeNew(params) {
  return request('/api/changeNeTypeNew',{
    method: 'POST',
    body: params,
  });
}

