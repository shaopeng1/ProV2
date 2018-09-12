import React, { PureComponent, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Drawer, List, Avatar, Divider, Col, Row } from 'antd';


const pStyle = {
  fontSize: 16,
  color: 'rgba(0,0,0,0.85)',
  lineHeight: '24px',
  display: 'block',
  marginBottom: 16,
};

const DescriptionItem = ({ title, content }) => (
  <div
    style={{
      fontSize: 14,
      lineHeight: '22px',
      marginBottom: 7,
      color: 'rgba(0,0,0,0.65)',
    }}
  >
    <p
      style={{
        marginRight: 8,
        display: 'inline-block',
        color: 'rgba(0,0,0,0.85)',
      }}
    >
      {title}:
    </p>
    {content}
  </div>
);


export default
class UpdateForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
     
    };
   }

    render() {
    	
       const { visible,onClose,userDetail }  = this.props

    	return(
    		<div>
  			 <Drawer
	          width={640}
	          placement="right"
	          closable={false}
	          onClose={onClose}
	          visible={visible}
	        >
	          <p style={{ ...pStyle, marginBottom: 24 }}>基本</p>
	          <p style={pStyle}>唯一标识</p>
	          <Row>
	            <Col span={12}>
	              <DescriptionItem title="无线用户类型" content="TETRA" />{' '}
	            </Col>
	            <Col span={12}>
	              <DescriptionItem title="标识" content={ userDetail.id } />
	            </Col>
	          </Row>
	          <Row>
	            <Col span={12}>
	              <DescriptionItem title="名称" content={ userDetail.name } />
	            </Col>
	            <Col span={12}>
	              <DescriptionItem title="别名" content={ userDetail.alias } />
	            </Col>
	          </Row>
	          <Row>
	            <Col span={12}>
	              <DescriptionItem title="S/N" content={ userDetail.snMarks }  />
	            </Col>
	            <Col span={12}>
	              <DescriptionItem title="TEL" content={ userDetail.tei } />
	            </Col>
	          </Row>

	          <Row>
	            <Col span={12}>
	              <DescriptionItem title="交换中心名" content={ userDetail.mscId }/>
	            </Col>
	            <Col span={12}>
	              <DescriptionItem title="虚拟专网名" content="虚拟专网名" />
	            </Col>
	          </Row>


	          <Row>
	            <Col span={12}>
	              <DescriptionItem title="警员编号" content="警员编号" />
	            </Col>
	            <Col span={12}>
	              <DescriptionItem title="单位" content="单位" />
	            </Col>
	          </Row>

	          <Row>
	            <Col span={12}>
	              <DescriptionItem title="警种" content="警种" />
	            </Col>
	          </Row>

	         
	          <Divider />
	          <p style={pStyle}>配置参数</p>
	          <Row>
	            <Col span={12}>
	              <DescriptionItem title="鉴权要求" content="鉴权要求" />
	            </Col>
	            <Col span={12}>
	              <DescriptionItem title="用户使能" content="用户使能" />
	            </Col>
	          </Row>
	          <Row>
	            <Col span={12}>
	              <DescriptionItem title="允许短数据" content="允许短数据" />
	            </Col>
	            <Col span={12}>
	              <DescriptionItem title="允许全双工" content="允许全双工" />
	            </Col>
	          </Row>
	          <Row>
	            <Col span={12}>
	              <DescriptionItem title="是否激活桥接前转" content="是否激活桥接前转" />
	            </Col>
	            <Col span={12}>
	              <DescriptionItem title="PSTN呼入" content="PSTN呼入" />
	            </Col>
	          </Row>

	          <Row>
	            <Col span={12}>
	              <DescriptionItem title="发射优先级" content="发射优先级" />
	            </Col>
	            <Col span={12}>
	              <DescriptionItem title="是否激活无应答前转" content="是否激活无应答前转" />
	            </Col>
	          </Row>

	          <Row>
	            <Col span={12}>
	              <DescriptionItem title="是否激活不可及前转" content="是否激活不可及前转" />
	            </Col>
	            <Col span={12}>
	              <DescriptionItem title="是否激活忙前转" content="是否激活忙前转" />
	            </Col>
	          </Row>

	          <Row>
	            <Col span={12}>
	              <DescriptionItem title="是否激活无条件前转" content="是否激活无条件前转" />
	            </Col>
	          </Row>

	          <Divider />
	          <p style={pStyle}>属性信息</p>
	          <Row>
	            <Col span={12}>
	              <DescriptionItem title="无线用户业务属性名" content="无线用户业务属性名" />
	            </Col>
	            <Col span={12}>
	              <DescriptionItem title="用户互联属性名" content="用户互联属性名" />
	            </Col>
	          </Row>

	          <Row>
	            <Col span={12}>
	              <DescriptionItem title="用户虚拟专网属性名" content="用户虚拟专网属性名" />
	            </Col>
	            <Col span={12}>
	              <DescriptionItem title="通话组列表名" content="通话组列表名" />
	            </Col>
	          </Row>

	          <Row>
	            <Col span={12}>
	              <DescriptionItem title="多归属交换集" content="无线用户业务属性名" />
	            </Col>
	          </Row>

	          <Divider />
	          <p style={pStyle}>分组参数</p>
	          <Row>
	            <Col span={12}>
	              <DescriptionItem title="允许分组数据" content="允许分组数据" />
	            </Col>
	            <Col span={12}>
	              <DescriptionItem title="用户类型" content="用户类型" />
	            </Col>
	          </Row>

	          <Row>
	            <Col span={12}>
	              <DescriptionItem title="分组使能" content="分组使能" />
	            </Col>
	            <Col span={12}>
	              <DescriptionItem title="地址" content="地址" />
	            </Col>
	          </Row>

	          <Divider />
	          <p style={pStyle}>无线用户主通话组</p>
	          <Row>
	            <Col span={24}>
	              <DescriptionItem title="主通话组" content="主通话组" />
	            </Col>
	          </Row>

	          <Divider />
	          <p style={pStyle}>环境监听</p>
	          <Row>
	            <Col span={12}>
	              <DescriptionItem title="允许环境监听" content="允许环境监听" />
	            </Col>
	            <Col span={12}>
	              <DescriptionItem title="允许环境监听初始化" content="允许环境监听初始化" />
	            </Col>
	          </Row>

	          <Divider />
	          <p style={pStyle}>互连参数</p>
	          <Row>
	            <Col span={12}>
	              <DescriptionItem title="直拨号码" content="直拨号码" />
	            </Col>
	            <Col span={12}>
	              <DescriptionItem title="允许PSTN接入" content="允许PSTN接入" />
	            </Col>
	          </Row>

	          <Row>
	            <Col span={12}>
	              <DescriptionItem title="允许PABX接入" content="允许PABX接入" />
	            </Col>
	            <Col span={12}>
	              <DescriptionItem title="主叫号码显示限制" content="主叫号码显示限制" />
	            </Col>
	          </Row>
	          <Row>
	            <Col span={12}>
	              <DescriptionItem title="主叫号码显示限制覆盖" content="主叫号码显示限制覆盖" />
	            </Col>
	            <Col span={12}>
	              <DescriptionItem title="摇启摇闭" content="摇启摇闭" />
	            </Col>
	          </Row>
	          <Row>
	            <Col span={12}>
	              <DescriptionItem title="MS类型" content="MS类型" />
	            </Col>
	            <Col span={12}>
	              <DescriptionItem title="移动台类型" content="移动台类型" />
	            </Col>
	          </Row>
	          <Row>
	            <Col span={24}>
	              <DescriptionItem title="厂家" content="厂家" />
	            </Col>
	          </Row>

	           <Divider />
	          <p style={pStyle}>备注信息栏</p>
	          <Row>
	            <Col span={12}>
	              <DescriptionItem title="备注1" content="备注1" />
	            </Col>
	            <Col span={12}>
	              <DescriptionItem title="备注2" content="备注2" />
	            </Col>
	          </Row>

	        </Drawer>
	     </div>   
    	)
    }
 }
