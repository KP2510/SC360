import React from 'react';
import { withRouter } from 'react-router'
import { withCookies } from 'react-cookie';
import HeaderBar from './HeaderBar';
import Communication from '../components/Communication/Communication';
import "antd/dist/antd.css";
import { Layout, Affix } from "antd";

const { Content, Header, Footer, Sider } = Layout;

const AppContainer = (props) => {
    const [collapsed, setCollapsed] = React.useState(true);
    return (
        <Layout>
            <Affix offsetTop={0.1}>
                <HeaderBar history={props.history} toggleCommunication={() => setCollapsed(!collapsed)} />
            </Affix>
            <Layout>
                <Content>{props.children}</Content>
                <Sider
                    collapsible
                    collapsedWidth={0}
                    width={300}
                    collapsed={collapsed}
                    style={{
                        overflow: "hidden",
                        height: "100vh",
                        position: "sticky",
                        background: "white",
                        boxShadow: "rgb(70, 70, 70) 0px 2px 8px 1px",
                        top: 40,
                        right: 0
                    }}
                >
                    <div style={{ minWidth: 300 }}>
                        <Communication collapsed={collapsed} />
                    </div>
                </Sider>
            </Layout>
        </Layout>
    );
}

export default withCookies(withRouter(AppContainer));