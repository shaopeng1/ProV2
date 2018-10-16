import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './TableList.less';
import moment from 'moment';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {Row,Col,Card,Form,Input,Select,Icon,Button,Dropdown,Menu,InputNumber,DatePicker,Modal,message,Badge,Divider,
        Steps,Radio,} from 'antd';


const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;


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


    
  render() {

        const { form: { getFieldDecorator },mscList,idNameList,neType,bsList,} = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
             <Col md={8} sm={24}>
               <FormItem label={ "时间"} >
                {getFieldDecorator('name')(
                    <RangePicker
                      ranges={{ '今天': [moment(), moment()], '本月': [moment(), moment().endOf('month')] }}
                      showTime
                      format="YYYY/MM/DD HH:mm:ss"
                    />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
               <FormItem label={ '统计周期'} >
                {getFieldDecorator('name1')(
                   <Select  style={{ width: '100%' }} onSelect={this.mscHandleChange}>
                    <Option value="5分钟">5分钟</Option>
                    <Option value="1">60分钟</Option>   
                    <Option value="2">每天</Option>
                    <Option value="3">周</Option>
                    <Option value="4">月</Option>
                  </Select>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
               <FormItem label={ '对象类型'} >
                {getFieldDecorator('name2')(
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
                {getFieldDecorator('name4')(
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
                {getFieldDecorator('msc')(
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
                  {getFieldDecorator('jizhan')(
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
                  {getFieldDecorator('调度')(
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
                  {getFieldDecorator('通话组')(
                     <Input/>
                   )}
                </FormItem>
             </Col>
             :null
          }

          {
            neType == 6 ?
              <Col md={8} sm={24}>
                 <FormItem label={ '用户' }>
                  {getFieldDecorator('用户')(
                     <Input/>
                   )}
                </FormItem>
             </Col>
             :null
          }

          {
            neType == 7 ?
              <Col md={8} sm={24}>
                 <FormItem label={ '虚拟专网' }>
                  {getFieldDecorator('虚拟专网')(
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
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                <FormattedMessage id="user.takeUp" defaultMessage="Take up"/> <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
     
     
    );
  }
}
