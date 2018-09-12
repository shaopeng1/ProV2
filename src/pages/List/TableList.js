import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {Row,Col,Card,Form,Input,Select,Icon,Button,Dropdown,Menu,InputNumber,DatePicker,Modal,message,Badge,Divider,
        Steps,Radio,} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DrawerUser from './DrawerUser';
import { detailUser } from '@/services/api';
import styles from './TableList.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

/* eslint react/no-multi-comp:0 */
export default
@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    userDetail: [],
    visible:false,//控制抽屉显示
    stepFormValues: {},
  };

   //显示详情
   showDrawer = (e) => {
    
    this.promise = detailUser({ "userId":e.id }).then((result) => {
      console.log("dddddddd"+result)
        this.setState({
          visible: true,
          userDetail:JSON.parse(result),
         });
      })  
  };

//关闭详情页
  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
      payload: {
        neType : '555',
      },
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {

    const { dispatch } = this.props;

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'rule/fetch',
      payload: params,
    });
  };


  //切换查询展开关闭
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

//未展开搜索条件
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
             <FormItem label={ <FormattedMessage id="user.list.mainGroup" defaultMessage="Main call group"/>} >
              {getFieldDecorator('name')(<Input/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
           <FormItem label={ <FormattedMessage id="user.list.callName" defaultMessage="Call list name"/> }>
              {getFieldDecorator('name2')(<Input/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                <FormattedMessage id="user.select" defaultMessage="Select"/>
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                <FormattedMessage id="user.reset" defaultMessage="reset"/>
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                <FormattedMessage id="user.takeUp" defaultMessage="Take up"/> <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

//展开搜索条件
  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label={ <FormattedMessage id="user.list.mainGroup" defaultMessage="Main call group"/>} >
              {getFieldDecorator('name')(<Input/> )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label={ <FormattedMessage id="user.list.callName" defaultMessage="Call list name"/> }>
              {getFieldDecorator('name2')(<Input/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label={ <FormattedMessage id="user.list.userInterconnectName" defaultMessage="User interconnect attribute name"/> }>
              {getFieldDecorator('name')(<Input/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label={ <FormattedMessage id="user.list.updateDate" defaultMessage="Update Date"/>}>
              {getFieldDecorator('date')(
                <DatePicker style={{ width: '100%' }}/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label={ <FormattedMessage id="user.list.MSType" defaultMessage="MS type"/> }>
              {getFieldDecorator('name3')(<Input/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label={ <FormattedMessage id="user.list.manufactor" defaultMessage="Manufactor"/> }>
              {getFieldDecorator('name4')(<Input/>)}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              <FormattedMessage id="user.select" defaultMessage="Select"/>
            </Button> 
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              <FormattedMessage id="user.reset" defaultMessage="reset"/>
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              <FormattedMessage id="user.takeUp" defaultMessage="Take up"/> <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {

    const  columns = [
    {
      title: <FormattedMessage id="radiouser.list.id" defaultMessage="id" />,
      dataIndex: 'id',
    },
    {
      title: <FormattedMessage id="jsp.user.marks" defaultMessage="dialer number" />,
      dataIndex: 'dialString',
      render:(text,record) => <span>{ record.radioType == '1' || record.radioType == '3' ? record.dialString : '---'}</span>
    },
    {
      title: <FormattedMessage id="radiouser.list.name" defaultMessage="name" />,
      dataIndex: 'name',
      render : (text,record) =><a onClick={e => this.showDrawer(record)}>{ text }</a>
    },
    {
       title: <FormattedMessage id="radiouser.list.enabled" defaultMessage="User enable" />,
      dataIndex: 'enabled',
      render: (text) => <span>{text == "true" ? '是' : '否'}</span>,
    },
    {
       title: <FormattedMessage id="radiouser.list.saName" defaultMessage="Wireless user name" />,
       dataIndex: 'saName',
    },
    {
       title: <FormattedMessage id="radiouser.list.iaName" defaultMessage="radiouser.list.iaName" />,
       dataIndex: 'iaName',
    },
    {
      title: <FormattedMessage id="user.baseOprator" defaultMessage="operation" />,
      render: (text, record) => (
        <Fragment>
          <a >
            <FormattedMessage id="user.update" defaultMessage="update" />
          </a>
          <Divider type="vertical" />
          <a href="">
            <FormattedMessage id="user.delete" defaultMessage="delete" />
          </a>
        </Fragment>
      ),
    },
  ];

    const {rule: { data, },loading,} = this.props;

    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">
          <FormattedMessage id="user.delete" defaultMessage="delete"/>
        </Menu.Item>
        <Menu.Item key="approval">
          <FormattedMessage id="user.list.batchApproval" defaultMessage="Batch approval"/>
        </Menu.Item>
      </Menu>
    );
  
    return (
      <PageHeaderWrapper title={ <FormattedMessage id="user.list.queryForm" defaultMessage="Query Form"/>}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                <FormattedMessage id="user.save" defaultMessage="save" />
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button>
                    <FormattedMessage id="user.list.batchOperation" defaultMessage="Batch operation"/>
                  </Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      <FormattedMessage id="user.list.more" defaultMessage ="More"/> <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card> 
        <DrawerUser visible = {this.state.visible} onClose = {this.onClose} userDetail = {this.state.userDetail}/>
      </PageHeaderWrapper>
    );
  }
}
