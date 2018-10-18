import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './TableList.less';
import StandardTable from '@/components/StandardTable';
import {Table,} from 'antd';
import reqwest from 'reqwest';

export default
@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))
class PerDataList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
        list:[],
    };
  }
 
  render() {

       const { columnList,perData,} = this.props;

    return (
		<Table
          columns={ columnList }
          dataSource={ perData }
         />
    );
  }
}
