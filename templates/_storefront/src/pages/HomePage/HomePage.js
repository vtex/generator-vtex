import React from 'react';
import './HomePage.less';
import HelloWorld from 'components/HelloWorld/HelloWorld';

class HomePage extends React.Component {
  render() {
    return (
      <div>
        <HelloWorld />
        <p className="message">Crie, construa, inove!</p>
      </div>
    );
  }
}

export default HomePage;
