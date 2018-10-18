import React, { PureComponent } from 'react';
import numeral from 'numeral';
import { connect } from 'dva';
import styles from './TableList.less';
import { getTimeDistance } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';
import { changeNeTypeNew,changeObj,getGSSIList,getISSIList,getDataReport, } from '@/services/performance';
import { formatMessage, FormattedMessage } from 'umi/locale';
import SearchForm from './SearchForm';
import PerDataList from './PerDataList';
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
      groupList: '',//通话组搜索数据
      userList: '',//用户数据
      columnList: '',//表头
      perData: '',//查询结果数据
      searchLoading: true,
      perItem: {
        pre:'1',
        neType:'1',
        indexSetId:'交换中心话务量总计',
        objSelectMscId:'',
        objSelectBsId:'1',
        targetObjId:'1',
      },
    };
  }

  componentDidMount() {
    this.typeHandleChange(1);
  }




 //遍历交换/基站option
  buildDictMsc = (name,dictItems)=>{
    const children = [];
    for(let i = 0; i < dictItems.length; i++){
      children.push(<Option key = {dictItems[i].id} value = {dictItems[i].id} searchValue = {dictItems[i].name}> { dictItems[i].name } </Option>)
    }
    return children;
  }

  //遍历通话组、用户option
  buildDictGroup = (name,dictItems)=>{
    const children = [];
    for(let i = 0; i < dictItems.length; i++){
      children.push(<Option key = {dictItems[i].id} value = {dictItems[i].id} searchValue = {dictItems[i].name}> { dictItems[i].id +"/"+ dictItems[i].name } </Option>)
    }
    return children;
  }


  //遍历指标集option
  buildDictIndex = (name,dictItems)=>{
    const children = [];
    for(let i = 0; i < dictItems.length; i++){
      children.push(<Option 
                       key = {dictItems[i].indexSetId} 
                       value = {dictItems[i].indexSetId} 
                       searchValue = {dictItems[i].indexSetName}
                     > 
                     { dictItems[i].indexSetName } 
                     </Option>)
     }
    return children;
  }

  //查询按钮
  handleSearch = e => {
    debugger
     const params = {
        startTime: e.searchDate[0].format("YYYY-MM-DD HH:mm:ss"),
        endTime: e.searchDate[1].format("YYYY-MM-DD HH:mm:ss"),
        neType: this.state.neType,//对象类型
        indexSetId: e.indexSetId,//指标集
        objSelectMscId: e.objSelectMscId,//交换
        objSelectBsId: e.objSelectBsId,//基站
        targetObjId: e.targetObjId,//调度
        pre: e.pre,//周期
        gId: e.gId,//组标识
        uId: e.uId,//用户标识
     }
     let perCoum = [];
     this.promise = getDataReport(params).then((result)=>{
       if(result.code == 200){
          debugger;  
          let res = JSON.parse(result.resMap);
          perCoum.push(
              {
                title: '测量开始时间',
                dataIndex: 'startTime',
                key: 'startTime',//没有主键先拿时间替代
              },
          )
          for(let i = 0; i<res.indexs.length; i++ ){
            //表头 
            perCoum.push(
              {
                title: res.indexs[i].indexName,
                dataIndex: "s"+res.indexs[i].indexId,
                key: res.indexs[i].indexId,
              },
            )
          }
          this.setState({
              columnList: perCoum,
              perData: res.list,
            })
        
       }else{
        message.error('数据获取异常，请稍后重试');
       }
     })
  };



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
             perItem: {
              pre:'1',
              neType:'1',
              indexSetId:'交换中心话务量总计',
              objSelectMscId:res.idName[0].name,
              objSelectBsId:'1',
              targetObjId:'1',
             } 
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
    if(result.code == 200){
      let res = JSON.parse(result.resMap);
      let bs = this.buildDictMsc("idName",res.idNames);//基站 /调度 
      this.setState({
        bsList: bs,
      })
    }else{
        message.error('数据获取异常，请稍后重试');
      }
  })
}

//通话组联想
getGSSIList = e =>{
  console.log("通话组输入为+"+e)
  this.promise = getGSSIList({"gId":e}).then((result)=>{
    if(result.code == 200){
       let res = JSON.parse(result.resMap);
       if(res.gssiList != undefined){
        let group = this.buildDictGroup("getGSSIList",res.gssiList);//通话组
        this.setState({
          groupList: group,
        })
       }
    }else{
       message.error('数据获取异常，请稍后重试');
    }
  })
}

//用户联想
getISSIList = e =>{
  console.log("用户+"+e)
  this.promise = getISSIList({"uId":e}).then((result)=>{
    if(result.code == 200){
       let res = JSON.parse(result.resMap);
       if(res.issiList != undefined){
        let user = this.buildDictGroup("getISSIList",res.issiList);//用户
        this.setState({
          userList: user,
        })
       }
    }else{
       message.error('数据获取异常，请稍后重试');
    }
  })
}

   
  render() {

    console.log("结果数据"+this.state.perData)

    const {mscList,idNameList,neType,bsList,groupList,userList,columnList,perData,perItem,searchLoading,} = this.state;

    return (

      <PageHeaderWrapper title={ <FormattedMessage id="menu.list.measurelist" defaultMessage="Query Form"/>}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
               <SearchForm 
                  typeHandleChange = { this.typeHandleChange }
                  mscHandleChange = { this.mscHandleChange }
                  getGSSIList = { this.getGSSIList }
                  getISSIList = { this.getISSIList }
                  handleSearch = { this.handleSearch }
                  mscList = { mscList }
                  idNameList = { idNameList }
                  neType = { neType }
                  bsList = { bsList }
                  groupList = { groupList }
                  userList  = { userList }
                  perItem = { perItem }
                  searchLoading = { searchLoading }
                />
                <PerDataList columnList = { columnList } perData = { perData }/>
            </div>
          </div> 
        </Card> 
      </PageHeaderWrapper>
     
    );
  }
}
