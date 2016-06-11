import client from 'cheerio-httpcli';
import xstream from 'xstream';
import { parseOnairCommunities } from '../utils/bookmark-api-parser';

class CommunityClient {
  constructor() {
    this.timer = null;
  }

  getCommunites(email, password) {
    return client.fetch('https://account.nicovideo.jp/login').then((response) => {
      return response.$('form[id=login_form]').submit({mail_tel: email, password: password});
    }).then((result) => {
      // login succeeded if result.cookies.user_session exist.
      if(result.response.cookies.user_session){
        return this._getCommunities(result, 1);
      } else {
        throw 'login failed';
      }
    }).catch((e) => {
      throw e;
    });
  }

  _getCommunities(result, page) {
    return client.fetch(`http://com.nicovideo.jp/community?page=${page}`)
      .then((result) => {
        const dom = result.$('div.com_frm');
        const communities =  Object.keys(dom).map((key)=> {
          try {
            const com = dom[`${key}`].children[0].children[0].children[1].children[1].children[0];
            return {title: com.children[0].data, comid: com.attribs.href.replace('/community/', '')};
          } catch(e) {
            return undefined;
          }
        }).filter((e) => {return e != undefined;});
        if (communities.length >= 30) {
          return this._getCommunities(result, ++page).then((next) => {
            return communities.concat(next);
          });
        } else {
          return communities;
        }
      }
    );
  }

  getStream(interval, subscribes) {
    clearInterval(this.timer);
    const producer = {
      start: listener => {
        const func = (page) => {
        const pageNum = page ? page : 1;
        client.fetch('http://live.nicovideo.jp/api/bookmark/json?type=onair&page=' + pageNum)
          .then((result) = > {
            // result.body has json data.
            parseOnairCommunities(JSON.parse(result.body), subscribes);
            this.timer = setTimeout(func, interval);
          });
        };
        func(1);
      },
      stop: error => console.log(error),
      id: 0
    };
    return xs.create(producer);
  }
}

export default new CommunityClient();
