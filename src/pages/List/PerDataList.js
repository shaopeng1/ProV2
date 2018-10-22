import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {Table,} from 'antd';

export default
@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))
class PerDataList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
        
    };
  }

  //翻页
  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  };
 

  render() {

       const { columnList,perData,} = this.props;

    return (
      <div>
  		  <Table
            rowKey={record => record.id}
            pagination={perData.pagination}
            columns={ columnList }
            scroll={{ x: 3000 }}
            dataSource={ perData.data }
            onChange={this.handleTableChange}
           />
      </div>
    );
  }
}
