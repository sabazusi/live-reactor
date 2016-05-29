import React from 'react';
import CommunityStorage from '../community-storage';

export default class Setting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subscribeList: CommunityStorage.getSubscribeCommunities()
    };
  }

  getStyle(comid) {
    return this.state.subscribeList.includes(comid) ?
      'selected' : 'unselected';
  }

  _onClick(e) {
    CommunityStorage.toggle(e.target.id);
    this.setState({
      subscribeList: CommunityStorage.getSubscribeCommunities()
    });
  }

  getCommunities() {
    return this.props.communities.map((community, i) => {
      return <div
        key={i}
        id={community.comid}
        className={this.getStyle(community.comid)}
        onClick={this._onClick.bind(this)}
      >
        {community.comid} => {community.title}
      </div>
    });
  }
  render() {
    return (
      <div>
        {this.getCommunities()}
      </div>
    )
  }
}