import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './TableList.less';
import moment from 'moment';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {Row,Col,Card,Form,Input,Select,Icon,Button,Dropdown,Menu,InputNumber,DatePicker,Modal,message,Badge,Divider,
        Steps,Radio,Spin,} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

const date = new Date();
const startDate=date.toLocaleDateString();//获取当前日期（年月日）

export default
@Form.create()
@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))
class SearchForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

//切换对象类型
typeHandleChange = e =>{
	const { typeHandleChange } = this.props;
	typeHandleChange(e);
}

//选择交换
mscHandleChange = e =>{
	const { mscHandleChange } = this.props;
	mscHandleChange(e);
}

//通话组联想
fetchGroup  = e =>{
	const { getGSSIList } = this.props;
	getGSSIList(e);
}

//用户联想
fetchUser  = e =>{
	const { getISSIList } = this.props;
	getISSIList(e);
}

//重置
 handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
  };

  //查询
  handleSearch = e => {
  	e.preventDefault();
  	const { handleSearch } = this.props;
     this.props.form.validateFields((errors, fieldsValue) => {
	      if (errors) {
	        return
	      }
	      const data = {
	      	 ...fieldsValue,
	      }
	      console.log("查询数据",data);
	      handleSearch(data);
	    })
  };
   
  render() {

        const { 
        	form: { getFieldDecorator },mscList,idNameList,neType,
            bsList,groupList,userList,searchLoading,defaultPre, 
            defaultNeType,defaultIndexSetId, defaultObjSelectBsId, 
            defaultObjSelectMscId,defaultTargetObjId,
        } = this.props;

    return (
    <Spin spinning={ searchLoading }>
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
             <Col md={8} sm={24}>
               <FormItem label={ "时间"} >
                {getFieldDecorator('searchDate',{
                	initialValue:[moment(startDate).startOf('day'),moment(startDate).endOf('day')],
                	rules: [
			            {
			             required: true, 
			             message: '选择查询时间' ,
			           },
			        ],
                })( 
                    <RangePicker
                      style={{width:400}}
                      ranges={{ '今天': [moment(), moment()], '本月': [moment(), moment().endOf('month')] }}
                      showTime
                      format="YYYY/MM/DD HH:mm:ss"
                    />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
               <FormItem label={ '统计周期'} >
                {getFieldDecorator('pre',{
                	initialValue:defaultPre,
                	rules: [
			            {
			             required: true, 
			             message: '请选择统计周期 !' ,
			           },
			        ],
                    })(
                   <Select  style={{ width: '100%' }} >
                    <Option value="0">5分钟</Option>
                    <Option value="1">60分钟</Option>   
                    <Option value="2">每天</Option>
                    <Option value="3">周</Option>
                    <Option value="4">月</Option>
                  </Select>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
               <FormItem label={ '对象类型'} >
                {getFieldDecorator('neType',{
                	initialValue:defaultNeType,
                	rules: [
			            {
			             required: true, 
			             message: '请选择对象类型 !' ,
			           },
			        ],
                    })(
                   <Select  style={{ width: '100%' }} onSelect={this.typeHandleChange}>
                    <Option value="1">交换中心</Option>
                    <Option value="2">基站</Option>   
                    <Option value="3">调度</Option>
                    <Option value="5">通话组</Option>
                    <Option value="6">用户</Option>
                    <Option value="7">虚拟专网</Option>
                  </Select>)}
              </FormItem>
            </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
             <FormItem label={ '指标集' } >
                {getFieldDecorator('indexSetId',{
                	initialValue:defaultIndexSetId,
                	rules: [
			            {
			             required: true, 
			             message: '指标集不能为空' ,
			           },
			        ],
                })(
                    <Select showSearch>
                      {
                        idNameList
                      }
                    </Select>
                  )}
            </FormItem>
          </Col>

          {
            (neType == 1 || neType == 2 || neType == 3)?
              <Col md={8} sm={24}>
               <FormItem label={ '交换' } >
                {getFieldDecorator('objSelectMscId',{
                	initialValue:defaultObjSelectMscId,
                	rules: [
			            {
			             required: true, 
			             message: '交换不能为空' ,
			           },
			        ],
                })(
                   <Select showSearch onSelect={this.mscHandleChange}>
                     {
                      mscList
                     }
                   </Select>
                 )}
              </FormItem>
            </Col>
            :null
          }

          {
            neType == 2 ?
              <Col md={8} sm={24}>
                 <FormItem label={ '基站' }>
                  {getFieldDecorator('objSelectBsId',{
                  	initialValue:defaultObjSelectBsId,
                  	rules: [
			            {
			             required: true, 
			             message: '基站不能为空' ,
			           },
			        ],
                  })(
                     <Select showSearch>
                       {
                        bsList
                       }
                     </Select>
                   )}
                </FormItem>
             </Col>
             :null
          }
          

          {
            neType == 3 ?
              <Col md={8} sm={24}>
                 <FormItem label={ '调度' }>
                  {getFieldDecorator('targetObjId',{
                  	initialValue:defaultTargetObjId,
                  	rules: [
			            {
			             required: true, 
			             message: '调度不能为空' ,
			           },
			        ],
                  })(
                     <Select showSearch>
                       {
                        bsList
                       }
                     </Select>
                   )}
                </FormItem>
             </Col>
             :null
          }

          {
            neType == 5 ?
              <Col md={8} sm={24}>
                 <FormItem label={ '通话组' }>
                  {getFieldDecorator('gId',{
                  	rules: [
			            {
			             required: true, 
			             message: '通话组信息不能为空' ,
			           },
			        ],
                  })(
                     <Select showSearch onSearch={this.fetchGroup} >
                     	{
                     		groupList
                     	}
                     </Select>
                   )}
                </FormItem>
             </Col>
             :null
          }

          {
            neType == 6 ?
              <Col md={8} sm={24}>
                 <FormItem label={ '用户' }>
                  {getFieldDecorator('uId',{
                  	rules: [
			            {
			             required: true, 
			             message: '用户信息不能为空' ,
			           },
			        ],
                  })(
                     <Select showSearch onSearch={this.fetchUser}>
                     	{
                     		userList
                     	}
                     </Select>
                   )}
                </FormItem>
             </Col>
             :null
          }

          {
            neType == 7 ?
              <Col md={8} sm={24}>
                 <FormItem label={ '虚拟专网' }>
                  {getFieldDecorator('虚拟专网',{
                  	rules: [
			            {
			             required: true, 
			             message: '虚拟专网不能为空' ,
			           },
			        ],
                  })(
                     <Input/>
                   )}
                </FormItem>
             </Col>
             :null
          }
          
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                <FormattedMessage id="user.select" defaultMessage="Select"/>
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                <FormattedMessage id="user.reset" defaultMessage="reset"/>
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
     </Spin>
    );
  }
}
