import React from 'react';
import { stores } from 'sdk';

// Get Area component provided by the Storefront SDK
const Area = stores.ComponentStore.state.getIn(['Area@vtex.storefront-sdk', 'constructor']);

// You can import LESS (.less) or Sass (.scss) files, their CSS will be included in the page
import './HomePage.less';

// You can import another React component
import HelloWorld from './HelloWorld/HelloWorld';

class HomePage extends React.Component {
  render() {
    return (
      <div>
        <HelloWorld />
        <Area id="home/banner"/>
        <p className="message">Crie, construa, inove!</p>
      </div>
    );
  }
}

export default HomePage;
