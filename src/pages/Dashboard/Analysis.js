import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {Row,Col,Icon,Card,Tabs,Table,Radio,DatePicker,Tooltip,Menu,Dropdown,Select,} from 'antd';
import {ChartCard,MiniArea,MiniBar,MiniProgress,Field,Bar,Pie,TimelineChart,} from '@/components/Charts';
import Trend from '@/components/Trend';
import NumberInfo from '@/components/NumberInfo';
import numeral from 'numeral';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Yuan from '@/utils/Yuan';
import { changeType,perList, } from '@/services/api';
import { getTimeDistance } from '@/utils/utils';

import styles from './Analysis.less';

const { TabPane } = Tabs;
const Option = Select.Option;
const { RangePicker } = DatePicker;

/*const rankingListData = [];*/
const salesExtra = [];//查询
const perCoum = [];//老版列表头数组
const salesBS = [];//交换《option》

/*for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: `工专路 ${i} 号店`,
    total: 323234,
  });
}*/

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
class Analysis extends Component {
  constructor(props) {
    super(props);
    /*this.rankingListData = [];
    for (let i = 0; i < 7; i += 1) {
      this.rankingListData.push({
        title: formatMessage({ id: 'app.analysis.test' }, { no: i }),
        total: 323234,
      });
    }*/
    this.state = {
      salesType: 'all',
      currentTabKey: '',
      loading: true,
      tablePer:'',//老版表头数据
      tablePerData: '',//老版data
      selectBSData:'',//查询数据
      data: {
        list: [],
        pagination: {},
      },
      rangePickerValue: getTimeDistance('year'),
    };
  }

  state = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
  };

  componentDidMount() {
    this.selectBS();
    this.netype(1);
    this.selectPasPer();
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'chart/fetch',
      });
      this.timeoutId = setTimeout(() => {
        this.setState({
          loading: false,
        });
      }, 600);
    });
  }

  //获取老版数据
  selectPasPer = e =>{
    this.promise = perList({}).then(result =>{
     /* perCoum.splice(0,perCoum.length);
      let res  = JSON.parse(result);
      //将对象的所有列名取出
      let coum = [];
      for(let c in res.total){
        coum.push(
            {c}
          )
      }
      
      for(let i = 0; i<res.indexs.length; i++ ){
        //表头 
        perCoum.push(
          {
            title: res.indexs[i].indexName,
            dataIndex: coum[i].c,
            key: res.indexs[i].startTime,//没有主键先拿时间替代
          },
        )  
      }
      this.setState({
        tablePer : perCoum,
        // data.list: res.list,
        // data.pagination: res.pagination,
        data:{
          list: res.list,
          pagination: res.pagination,
        }
      })*/
    })
  } 

  //根据交换获取排名数
  netype = (selectedKeys, info) =>{
   const { dispatch } = this.props;
   dispatch({
    type: 'chart/bSranking',
    payload: {
        neType : selectedKeys,
      },
   })
  }

  loopBS =(data)=>{
      salesBS.splice(0,salesBS.length);
    for(let i = 0; i<data.length; i++){
      salesBS.push(
        <Option value = {data[i].id}> {data[i].name} </Option>
      )
    }
    return salesBS;
  }




  //获取交换列表
  selectBS = e =>{
    this.promise = changeType({'neType' : e}).then(result => {
/*      salesExtra.splice(0,salesExtra.length);
      let res = JSON.parse(result);
      this.loopBS(res.idName);
      salesExtra.push(
          <div className={styles.salesExtraWrap}>
            <div className={styles.salesExtra}>
               统计周期：
               <Select defaultValue="0" style={{ width: 120 }} >
                  <Option value="0">5分钟</Option>
                  <Option value="1">60分钟</Option>
                  <Option value="2">每天</Option>
                  <Option value="3">周</Option>
                  <Option value="4">月</Option>
                </Select>
            </div>
            <div className={styles.salesExtra}>
              指标集：
               <Select defaultValue="0" style={{ width: 200 }} >
                  <Option value="0">交换中心话务量总计</Option>
                  <Option value="1">交换中心成功呼叫详情</Option>
                  <Option value="2">交换中心呼损详情</Option>
                </Select>
            </div>
            <div className={styles.salesExtra}>
              交换：
              <Select defaultValue= {res.idName[0].id} style={{ width: 180 }} onSelect = {this.netype}>
              {
                salesBS
              }
            </Select>
           </div>
          </div>
        )
        this.setState({
          selectBSData:salesExtra,
        })*/
    })
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  }

  handleChangeSalesType = e => {
    this.setState({
      salesType: e.target.value,
    });
  };

  handleTabChange = key => {
    this.setState({
      currentTabKey: key,
    });
  };

  handleRangePickerChange = rangePickerValue => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue,
    });

    dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  selectDate = type => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });

    dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  isActive(type) {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
    return '';
  }

  render() {

    

    const { rangePickerValue, salesType, loading: propsLoding, currentTabKey,data: { list, pagination } } = this.state;
    const { chart,chart:{ alarm } ,loading: stateLoading } = this.props;
    const {
      visitData,
      visitData2,
      salesData,
      searchData,
      offlineData,
      offlineChartData,
      rankingListData,
      salesTypeData,
      salesTypeDataOnline,
      salesTypeDataOffline,
    } = chart;


    const loading = propsLoding || stateLoading;
    let salesPieData;
    if (salesType === 'all') {
      salesPieData = salesTypeData;
    } else {
      salesPieData = salesType === 'online' ? salesTypeDataOnline : salesTypeDataOffline;
    }
    const menu = (
      <Menu>
        <Menu.Item>操作一</Menu.Item>
        <Menu.Item>操作二</Menu.Item>
      </Menu>
    );

    const iconGroup = (
      <span className={styles.iconGroup}>
        <Dropdown overlay={menu} placement="bottomRight">
          <Icon type="ellipsis" />
        </Dropdown>
      </span>
    );

    

    const columns = [
      {
        title: <FormattedMessage id="app.analysis.table.rank" defaultMessage="Rank" />,
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: (
          <FormattedMessage
            id="app.analysis.table.search-keyword"
            defaultMessage="Search keyword"
          />
        ),
        dataIndex: 'keyword',
        key: 'keyword',
        render: text => <a href="/">{text}</a>,
      },
      {
        title: <FormattedMessage id="app.analysis.table.users" defaultMessage="Users" />,
        dataIndex: 'count',
        key: 'count',
        sorter: (a, b) => a.count - b.count,
        className: styles.alignRight,
      },
      {
        title: (
          <FormattedMessage id="app.analysis.table.weekly-range" defaultMessage="Weekly Range" />
        ),
        dataIndex: 'range',
        key: 'range',
        sorter: (a, b) => a.range - b.range,
        render: (text, record) => (
          <Trend flag={record.status === 1 ? 'down' : 'up'}>
            <span style={{ marginRight: 4 }}>{text}%</span>
          </Trend>
        ),
        align: 'right',
      },
    ];

    const activeKey = currentTabKey || (offlineData[0] && offlineData[0].name);

    const CustomTab = ({ data, currentTabKey: currentKey }) => (
      <Row gutter={8} style={{ width: 138, margin: '8px 0' }}>
        <Col span={12}>
          <NumberInfo
            title={data.name}
            subTitle={
              <FormattedMessage
                id="app.analysis.conversion-rate"
                defaultMessage="Conversion Rate"
              />
            }
            gap={2}
            total={`${data.cvr * 100}%`}
            theme={currentKey !== data.name && 'light'}
          />
        </Col>
        <Col span={12} style={{ paddingTop: 36 }}>
          <Pie
            animate={false}
            color={currentKey !== data.name && '#BDE4FF'}
            inner={0.55}
            tooltip={false}
            margin={[0, 0, 0, 0]}
            percent={data.cvr * 100}
            height={64}
          />
        </Col>
      </Row>
    );

    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 6,
      style: { marginBottom: 24 },
    };

    return (
      <GridContent>
        <Row gutter={24}>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title={
                <FormattedMessage id="app.analysis.total-sales" defaultMessage="Total Sales" />
              }
              action={
                <Tooltip
                  title={
                    <FormattedMessage id="app.analysis.introduce" defaultMessage="introduce" />
                  }
                >
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              loading={loading}
              total={() => <Yuan>126560</Yuan>}
              footer={
                <Field
                  label={
                    <FormattedMessage id="app.analysis.day-sales" defaultMessage="Day Sales" />
                  }
                  value={`￥${numeral(12423).format('0,0')}`}
                />
              }
              contentHeight={46}
            >
              <Trend flag="up" style={{ marginRight: 16 }}>
                <FormattedMessage id="app.analysis.week" defaultMessage="Weekly Changes" />
                <span className={styles.trendText}>12%</span>
              </Trend>
              <Trend flag="down">
                <FormattedMessage id="app.analysis.day" defaultMessage="Daily Changes" />
                <span className={styles.trendText}>11%</span>
              </Trend>
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              loading={loading}
              title={<FormattedMessage id="app.analysis.visits" defaultMessage="visits" />}
              action={
                <Tooltip
                  title={
                    <FormattedMessage id="app.analysis.introduce" defaultMessage="introduce" />
                  }
                >
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={numeral(8846).format('0,0')}
              footer={
                <Field
                  label={
                    <FormattedMessage id="app.analysis.day-visits" defaultMessage="Day Visits" />
                  }
                  value={numeral(1234).format('0,0')}
                />
              }
              contentHeight={46}
            >
              <MiniArea color="#975FE4" data={visitData} />
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              loading={loading}
              title={<FormattedMessage id="app.analysis.payments" defaultMessage="Payments" />}
              action={
                <Tooltip
                  title={
                    <FormattedMessage id="app.analysis.introduce" defaultMessage="Introduce" />
                  }
                >
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={numeral(6560).format('0,0')}
              footer={
                <Field
                  label={
                    <FormattedMessage
                      id="app.analysis.conversion-rate"
                      defaultMessage="Conversion Rate"
                    />
                  }
                  value="60%"
                />
              }
              contentHeight={46}
            >
              <MiniBar data={visitData} />
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              loading={loading}
              bordered={false}
              title={
                <FormattedMessage
                  id="app.analysis.operational-effect"
                  defaultMessage="Operational Effect"
                />
              }
              action={
                <Tooltip
                  title={
                    <FormattedMessage id="app.analysis.introduce" defaultMessage="introduce" />
                  }
                >
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total="78%"
              footer={
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  <Trend flag="up" style={{ marginRight: 16 }}>
                    <FormattedMessage id="app.analysis.week" defaultMessage="Weekly changes" />
                    <span className={styles.trendText}>12%</span>
                  </Trend>
                  <Trend flag="down">
                    <FormattedMessage id="app.analysis.day" defaultMessage="Weekly changes" />
                    <span className={styles.trendText}>11%</span>
                  </Trend>
                </div>
              }
              contentHeight={46}
            >
              <MiniProgress percent={78} strokeWidth={8} target={80} color="#13C2C2" />
            </ChartCard>
          </Col>
        </Row>

        <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
          <div className={styles.salesCard}>
            <Tabs tabBarExtraContent={this.state.selectBSData} size="large" tabBarStyle={{ marginBottom: 24 }}>
              <TabPane
                tab={<FormattedMessage id="app.analysis.sales" defaultMessage="Sales" />}
                key="sales"
              >
                <Row>
                  <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Bar
                        height={295}
                        title={
                          <FormattedMessage
                            id="app.analysis.sales-trend"
                            defaultMessage="Sales Trend"
                          />
                        }
                        data={salesData}
                      />
                    </div>
                  </Col>
                  <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesRank}>
                      <h4 className={styles.rankingTitle}>
                        <FormattedMessage
                          id="app.analysis.sales-ranking"
                          defaultMessage="Sales Ranking"
                        />
                      </h4>
                      <ul className={styles.rankingList}>
                        {rankingListData.map((item, i) => (
                          <li key={item.title}>
                            <span
                              className={`${styles.rankingItemNumber} ${
                                i < 3 ? styles.active : ''
                              }`}
                            >
                              {i + 1}
                            </span>
                            <span className={styles.rankingItemTitle} title={item.title}>
                              {item.title}
                            </span>
                            <span className={styles.rankingItemValue}>
                              {numeral(item.total).format('0,0')}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Col>
                </Row>
              </TabPane>
              <TabPane
                tab={<FormattedMessage id="app.analysis.visits" defaultMessage="Visits" />}
                key="views"
              >
                <Row>
                  <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Bar
                        height={292}
                        title={
                          <FormattedMessage
                            id="app.analysis.visits-trend"
                            defaultMessage="Visits Trend"
                          />
                        }
                        data={salesData}
                      />
                    </div>
                  </Col>
                  <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesRank}>
                      <h4 className={styles.rankingTitle}>
                        <FormattedMessage
                          id="app.analysis.visits-ranking"
                          defaultMessage="Visits Ranking"
                        />
                      </h4>
                      <ul className={styles.rankingList}>
                        {rankingListData.map((item, i) => (
                          <li key={item.title}>
                            <span className={i < 3 ? styles.active : ''}>{i + 1}</span>
                            <span>{item.title}</span>
                            <span>{numeral(item.total).format('0,0')}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </div>
        </Card>

        <Row gutter={24}>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card
              loading={loading}
              bordered={false}
              title={
                <FormattedMessage
                  id="app.analysis.online-top-search"
                  defaultMessage="Online Top Search"
                />
              }
              extra={iconGroup}
              style={{ marginTop: 24 }}
            >
              <Row gutter={68}>
                <Col sm={12} xs={24} style={{ marginBottom: 24 }}>
                  <NumberInfo
                    subTitle={
                      <span>
                        <FormattedMessage
                          id="app.analysis.search-users"
                          defaultMessage="search users"
                        />
                        <Tooltip
                          title={
                            <FormattedMessage
                              id="app.analysis.introduce"
                              defaultMessage="introduce"
                            />
                          }
                        >
                          <Icon style={{ marginLeft: 8 }} type="info-circle-o" />
                        </Tooltip>
                      </span>
                    }
                    gap={8}
                    total={numeral(12321).format('0,0')}
                    status="up"
                    subTotal={17.1}
                  />
                  <MiniArea line height={45} data={visitData2} />
                </Col>
                <Col sm={12} xs={24} style={{ marginBottom: 24 }}>
                  <NumberInfo
                    subTitle={
                      <FormattedMessage
                        id="app.analysis.per-capita-search"
                        defaultMessage="Per Capita Search"
                      />
                    }
                    total={2.7}
                    status="down"
                    subTotal={26.2}
                    gap={8}
                  />
                  <MiniArea line height={45} data={visitData2} />
                </Col>
              </Row>
              <Table
                rowKey={record => record.index}
                size="small"
                columns={columns}
                dataSource={searchData}
                pagination={{
                  style: { marginBottom: 0 },
                  pageSize: 5,

                }}
              />
            </Card>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card
              loading={loading}
              className={styles.salesCard}
              bordered={false}
              title={
                <FormattedMessage
                  id="app.analysis.the-proportion-of-sales"
                  defaultMessage="The Proportion of Sales"
                />
              }
              bodyStyle={{ padding: 24 }}
              extra={
                <div className={styles.salesCardExtra}>
                  {iconGroup}
                  <div className={styles.salesTypeRadio}>
                    <Radio.Group value={salesType} onChange={this.handleChangeSalesType}>
                      <Radio.Button value="all">
                        <FormattedMessage id="app.analysis.channel.all" defaultMessage="ALL" />
                      </Radio.Button>
                      <Radio.Button value="online">
                        <FormattedMessage
                          id="app.analysis.channel.online"
                          defaultMessage="Online"
                        />
                      </Radio.Button>
                      <Radio.Button value="stores">
                        <FormattedMessage
                          id="app.analysis.channel.stores"
                          defaultMessage="Stores"
                        />
                      </Radio.Button>
                    </Radio.Group>
                  </div>
                </div>
              }
              style={{ marginTop: 24, minHeight: 509 }}
            >
              <h4 style={{ marginTop: 8, marginBottom: 32 }}>
                <FormattedMessage id="app.analysis.sales" defaultMessage="Sales" />
              </h4>
              <Pie
                hasLegend
                subTitle={<FormattedMessage id="app.analysis.sales" defaultMessage="Sales" />}
                total={() => <Yuan>{salesPieData.reduce((pre, now) => now.y + pre, 0)}</Yuan>}
                data={salesPieData}
                valueFormat={value => <Yuan>{value}</Yuan>}
                height={248}
                lineWidth={4}
              />
            </Card>
          </Col>
        </Row>

        <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }} style={{ marginTop: 32 }}>
          <div className={styles.salesCard}>
            <Tabs tabBarExtraContent={this.state.selectBSData} size="large" tabBarStyle={{ marginBottom: 24 }}>
              <TabPane
                tab={<FormattedMessage id="app.analysis.sales" defaultMessage="Sales" />}
                key="sales"
              >
                 <Table
                  rowKey={record => record.index}
                  size="small"
                  columns={this.state.tablePer}
                  dataSource={list}
                  pagination={pagination}
                />
              </TabPane>
              <TabPane
                tab={<FormattedMessage id="app.analysis.visits" defaultMessage="Visits" />}
                key="views"
              >
               
              </TabPane>
            </Tabs>
          </div>
        </Card>

        <Card 
          title="告警种类占比" 
          bordered={false} 
          className={styles.offlineCard}
          bodyStyle={{ padding: '0 0 32px 0' }}
          style={{ marginTop: 32 }}
        >
              <Row style={{ padding: '16px 0' }}>
                <Col span={5}>
                  <Pie
                    animate={false}
                    color="#e61818"
                    percent={99}
                    subTitle="紧急告警"
                    total="99%"
                    height={159}
                    lineWidth={2}
                  />
                </Col>
                <Col span={5}>
                  <Pie
                    animate={false}
                    color="#1ee618"
                    percent={22}
                    subTitle="主要告警"
                    total="22%"
                    height={159}
                    lineWidth={2}
                  />
                </Col>
                <Col span={5}>
                  <Pie
                    animate={false}
                    color="#eeef08"
                    percent={32}
                    subTitle="次要告警"
                    total="32%"
                    height={159}
                    lineWidth={2}
                  />
                </Col>
                <Col span={5}>
                  <Pie
                    animate={false}
                    color="#08dcef"
                    percent={32}
                    subTitle="一般通知"
                    total="32%"
                    height={159}
                    lineWidth={2}
                  />
                </Col>
                <Col span={4}>
                  <Pie
                    animate={false}
                    color="#0d1ace"
                    percent={32}
                    subTitle="恢复"
                    total="32%"
                    height={159}
                    lineWidth={2}
                  />
                </Col>
              </Row>
            </Card>
      </GridContent>
    );
  }
}

export default Analysis;
