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
      columnList: [],//表头
      searchParams: '',//存储查询条件数据
      searchLoading: true,
      firstOpen:true,//是否第一次打开页面
      perData: {//查询结果数据
        data: [],
        total:[],//总计
        pagination: {},
      },
      //***************************************************
      defaultPre:'1',
      defaultNeType:'1',
      defaultIndexSetId:'',
      defaultObjSelectMscId:'',
      defaultObjSelectBsId:'',
      defaultTargetObjId:'',
      //***************************************************
    };
  }

  componentDidMount() {
    this.typeHandleChange(1);
  }

  //翻页
   handleStandardTableChange = (pagination, filtersArg, sorter) => {
    debugger
    const { searchParams } = this.state;

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };
     let perCoum = [];
     this.promise = getDataReport({"page":params,"params":searchParams}).then((result)=>{
       if(result != undefined && result.code == 200){
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
              // perData: res.list,
              perData: {
                data:res.list,
                pagination:res.pagination,
              }
            })
        
       }else{
        message.error('数据获取异常，请稍后重试');
       }
     }) 
  };


 //遍历交换/基站option
  buildDictMsc = (name,dictItems)=>{
    const children = [];
    for(let i = 0; i < dictItems.length; i++){
      children.push(<Option key = {dictItems[i].id} value = {dictItems[i].id} > { dictItems[i].name } </Option>)
    }
    return children;
  }

  //遍历通话组、用户option
  buildDictGroup = (name,dictItems)=>{
    const children = [];
    for(let i = 0; i < dictItems.length; i++){
      children.push(<Option key = {dictItems[i].id} value = {dictItems[i].id}> { dictItems[i].id +"/"+ dictItems[i].name } </Option>)
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
                     > 
                     { dictItems[i].indexSetName } 
                     </Option>)
     }
    return children;
  }

  //查询按钮
  handleSearch = e => {
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
     this.setState({
      searchParams: params,
     })

     this.promise = getDataReport({"params":params}).then((result)=>{
       if(result != undefined && result.code == 200){
          let res = JSON.parse(result.resMap);

          this.processingList(res);
       }else{
        message.error('数据获取异常，请稍后重试');
       }
     }) 
  };

  //处理查询列表数据
  processingList = e =>{
        let perCoum = [];
        perCoum.push(
            {
              title: '测量开始时间',
              dataIndex: 'startTime',
              fixed: 'left',
              key: 'startTime',//没有主键先拿时间替代
            },
        )
        for(let i = 0; i<e.indexs.length; i++ ){
          //表头 
          perCoum.push(
            {
              title: e.indexs[i].indexName,
              dataIndex: "s"+e.indexs[i].indexId,
              key: e.indexs[i].indexId,
            },
          )
        }
        this.setState({
          columnList: perCoum,
          perData: {
            data:e.list,
            pagination:e.pagination,
          }
        })
  }



//切换对象类型时触发
typeHandleChange = e => {
  console.log("交换类型+"+e)
  const { firstOpen } = this.state;
    this.setState({
      neType: e,
    })
    let params = {
      "neType": e,
      "firstOpen": firstOpen,
    }
    this.promise = changeNeTypeNew({ "params":params }).then((result) => {
        if(result != undefined && result.code == 200){
          let res = JSON.parse(result.resMap);
          if(res.idName != undefined){
           let idname = this.buildDictMsc("idName",res.idName);//交换
             if(e == 1 || e == 2 || e == 3){
                this.setState({
                 defaultObjSelectMscId: res.idName[0].id,
                })  
             }
              this.setState({
               mscList: idname,
              }) 
          }
          if(res.indexSet != undefined){
            let indexSet = this.buildDictIndex("indexSet",res.indexSet);//指标集  
            this.setState({
             idNameList: indexSet,
             defaultIndexSetId: res.indexSet[0].indexSetId,
            })
          }
          if(res.IdNames != undefined){
            let bs = this.buildDictMsc("idName",res.IdNames);//基站  
            this.setState({
              bsList: bs,
              defaultObjSelectBsId: res.IdNames[0].id,
            })
          }
          //初次查询列表数据处理
          if(firstOpen == true){
            this.processingList(res);  
          }
          
          this.setState({
            searchLoading:false,
            firstOpen:false,
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
  let params = {
    "selectObjValue":e,
    "selectObjType":"msc",
    "neType":neType,
  }
    this.promise = changeObj({"params":params}).then((result)=>{
    if(result != undefined && result.code == 200){
      let res = JSON.parse(result.resMap);
      let bs = this.buildDictMsc("idName",res.idNames);//基站 /调度
      this.setState({
        bsList: bs,
        defaultObjSelectBsId: res.idNames[0].id,
        defaultTargetObjId: res.idNames[0].id,
      })
    }else{
        message.error('数据获取异常，请稍后重试');
      }
  })
}

//通话组联想
getGSSIList = e =>{
  console.log("通话组输入为+"+e)
  let params = {
    "gId":e
  }
  this.promise = getGSSIList({"params":params}).then((result)=>{
    if(result != undefined && result.code == 200){
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
  let params = {
    "uId":e
  }
  this.promise = getISSIList({"params":params}).then((result)=>{
    if(result != undefined && result.code == 200){
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

    const {
        mscList, idNameList, neType, bsList, groupList, userList,
        columnList, perData, searchLoading, defaultPre, defaultNeType,
        defaultIndexSetId, defaultObjSelectBsId, defaultObjSelectMscId,
        defaultTargetObjId,
      } = this.state;

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
                  defaultPre = { defaultPre }
                  defaultNeType = { defaultNeType }
                  defaultIndexSetId = { defaultIndexSetId }
                  defaultObjSelectBsId = { defaultObjSelectBsId }
                  defaultObjSelectMscId = { defaultObjSelectMscId }
                  defaultTargetObjId = { defaultTargetObjId }
                  searchLoading = { searchLoading }
                  
                />

                <PerDataList columnList = { columnList } perData = { perData } onChange={this.handleStandardTableChange}/>
            </div>
          </div> 
        </Card> 
      </PageHeaderWrapper>
     
    );
  }
}
