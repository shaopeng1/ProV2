import React, { PureComponent } from 'react';
import numeral from 'numeral';
import { connect } from 'dva';
import styles from './TableList.less';
import { getTimeDistance } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';
import { changeNeTypeNew } from '@/services/performance';
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
class MeasureList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      mscList: '',//真是显示交换数据
      idNameList: '',//真是显示指标集数据
      neType: 1,//对象类型
      bsList: '',//基站
    };
  }

 //遍历交换/基站option
  buildDictMsc = (name,dictItems)=>{
    const children = [];
    for(let i = 0; i < dictItems.length; i++){
      children.push(<Option key = {dictItems[i].id} value = {dictItems[i].name} searchValue = {dictItems[i].name}> { dictItems[i].name } </Option>)
    }
    return children;
  }

  //遍历指标集option
  buildDictIndex = (name,dictItems)=>{
    const children = [];
    for(let i = 0; i < dictItems.length; i++){
      children.push(<Option 
                       key = {dictItems[i].indexSetId} 
                       value = {dictItems[i].indexSetName} 
                       searchValue = {dictItems[i].indexSetName}
                     > 
                     { dictItems[i].indexSetName } 
                     </Option>)
     }
    return children;
  }



//切换对象类型时触发
typeHandleChange = e => {
  console.log("交换类型+"+e)
    this.promise = changeNeTypeNew({ "neType":e }).then((result) => {
        if(result.code == 200){
          let res = JSON.parse(result.resMap);
          if(res.idName != undefined){
           let idname = this.buildDictMsc("idName",res.idName);//交换
            this.setState({
             mscList: idname, 
            }) 
          }
          if(res.indexSet != undefined){
            let indexSet = this.buildDictIndex("indexSet",res.indexSet);//指标集  
            this.setState({
             idNameList: indexSet,
            })
          }
          if(res.IdNames != undefined){
            let bs = this.buildDictMsc("idName",res.IdNames);//基站  
            this.setState({
              bsList: bs,
            })
          }
          this.setState({
            neType: e,
          })
        }else{
          message.error('数据获取异常，请稍后重试');
        }
      })  
}


 
 
//搜索条件
renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
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
                   <Select  style={{ width: '100%' }}>
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
                        this.state.idNameList
                      }
                    </Select>
                  )}
            </FormItem>
          </Col>

          {
            (this.state.neType == 1 || this.state.neType == 2 || this.state.neType == 3)?
              <Col md={8} sm={24}>
               <FormItem label={ '交换' }>
                {getFieldDecorator('msc')(
                   <Select showSearch>
                     {
                      this.state.mscList
                     }
                   </Select>
                 )}
              </FormItem>
            </Col>
            :null
          }

          {
            this.state.neType == 2 ?
              <Col md={8} sm={24}>
                 <FormItem label={ '基站' }>
                  {getFieldDecorator('jizhan')(
                     <Select showSearch>
                       {
                        this.state.bsList
                       }
                     </Select>
                   )}
                </FormItem>
             </Col>
             :null
          }
          

          {
            this.state.neType == 3 ?
              <Col md={8} sm={24}>
                 <FormItem label={ '调度' }>
                  {getFieldDecorator('调度')(
                     <Select showSearch>
                       {
                        this.state.bsList
                       }
                     </Select>
                   )}
                </FormItem>
             </Col>
             :null
          }

          {
            this.state.neType == 5 ?
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
            this.state.neType == 6 ?
              <Col md={8} sm={24}>
                 <FormItem label={ '用户' }>
                  {getFieldDecorator('用户')(
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


    
  render() {

    const {idNameList,mscList,} = this.state;
        
    return (

      <PageHeaderWrapper title={ <FormattedMessage id="menu.list.measurelist" defaultMessage="Query Form"/>}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
          </div> 
        </Card> 
      </PageHeaderWrapper>
     
    );
  }
}
