import React, { PureComponent } from 'react';
import numeral from 'numeral';
import { connect } from 'dva';
import styles from './TableList.less';
import { getTimeDistance } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';
import { changeNeTypeNew,changeObj, } from '@/services/performance';
import { formatMessage, FormattedMessage } from 'umi/locale';
import SearchForm from './SearchForm';
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
      children.push(<Option key = {dictItems[i].id} value = {dictItems[i].id} searchValue = {dictItems[i].name}> { dictItems[i].name } </Option>)
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

//切换交换时获取基站
mscHandleChange = e =>{
  console.log("交换+"+e)
  const {neType} = this.state;
  this.promise = changeObj({"selectObjValue":e,"selectObjType":"msc","neType":neType}).then((result)=>{
    console.log("________________________________________________________")
  })
}

   
  render() {

    const {mscList,idNameList,neType,bsList} = this.state;

    return (

      <PageHeaderWrapper title={ <FormattedMessage id="menu.list.measurelist" defaultMessage="Query Form"/>}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
               <SearchForm 
                  typeHandleChange = { this.typeHandleChange }
                  mscHandleChange = { this.mscHandleChange }
                  mscList = { mscList }
                  idNameList = { idNameList }
                  neType = { neType }
                  bsList = { bsList }
                />
            </div>
          </div> 
        </Card> 
      </PageHeaderWrapper>
     
    );
  }
}
