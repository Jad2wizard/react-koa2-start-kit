import { Router, Route, browserHistory, IndexRoute, Redirect } from 'react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
//添加moment获取日期格式的原型函数
moment.prototype.YMDHms = function () {
    return this.format('YYYY-MM-DD HH:mm:ss');
};
import {Layout} from 'antd';
import Login from './Home/Login';
import Test from './components/test';

import './utils/voiceCapture';
import {Provider} from 'react-redux';
import {syncHistoryWithStore} from 'react-router-redux';
import store from './store';
const history = syncHistoryWithStore(browserHistory, store);

const { Content } = Layout;
import styles from './index.scss';

/* eslint-disable */
if (module.hot) {
    module.hot.accept();
}
/* eslint-enable */

class Root extends React.Component{
    render(){
        const children = this.props.children;
        return (
            <Layout className='layout'>
                <Layout className={styles.pageLayout}>
                    <Content className={styles.pageContent}>
                        {
                            children && children || <Home />
                        }
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

class NotFoundPage extends React.Component{
    render(){
        return(
            <div>
                <h1>Route Page not found</h1>
            </div>
        );
    }
}

class Home extends React.Component{
    render(){
        return (
            <div>This is Home!</div>
        );
    }
}

const routes = (
    <Route>
        <Route path='/login' component={Login} />
        <Route path='/' component={Root}>
            <IndexRoute component={Test} />
            <Route path='/404' component={NotFoundPage} />
            <Redirect from='*' to='/404' />
        </Route>
    </Route>
);
/* eslint-enable */
class Routers extends React.Component{
    render(){
        return (
            <Router history={history} >
                {routes}
            </Router>
        );
    }
}

ReactDOM.render((
    <Provider store={store}>
        <Routers />
    </Provider>
), document.getElementById('main'));
