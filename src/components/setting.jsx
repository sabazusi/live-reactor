import React from 'react';
import CommunityStorage from '../utils/community-storage';

export default class Setting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subscribeList: CommunityStorage.getSubscribeCommunities(),
      checkIntervalSec: 60
    };
  }

  getStyle(comid) {
    return this.state.subscribeList.includes(comid) ?
      'selected' : 'unselected';
  }

  _onClickCom(e) {
    CommunityStorage.toggle(e.target.id);
    this.setState({
      subscribeList: CommunityStorage.getSubscribeCommunities()
    });
  }

  _onClickOk() {
    this.props.onClickSubscribe(this.state.checkInterval);
  }
  _onClickRelogin() {
    this.props.onClickRelogin();
  }

  getCommunities() {
    return this.props.communities.map((community, i) => {
      return <div
        key={i}
        id={community.comid}
        className={this.getStyle(community.comid)}
        onClick={this._onClickCom.bind(this)}
      >
        {community.comid}: {community.title}
      </div>
    });
  }

  getSubscribeSetting() {
    const optionDoms = [30, 60, 120, 180, 300, 600].map((sec) => {
      const selected = this.state.checkInterval === sec;
      return (
          <option
            selected={selected}
            value={sec}>
            {sec}
          </option>
        );
    });
    return (
      <select
        onChange={(e) => {this.setState({checkInterval: e.target.value});}}
      >
        {optionDoms}
      </select>
    );
  }

  render() {
    return (
      <div className={"settings"}>
        <div>
          <button onClick={this._onClickOk.bind(this)}>
            監視をスタート
          </button>
        </div>
        <div>
          <button onClick={this._onClickRelogin.bind(this)}>
            別のアカウントでログイン
          </button>
        </div>
        <div>
          <span style={this.textStyle}>更新間隔(秒)</span>
          {this.getSubscribeSetting()}
        </div>
        {this.getCommunities()}
      </div>
    )
  }
}
