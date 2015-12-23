import React from 'react';
// You can import images. A URL will be returned, see usage below
import logo from 'assets/images/logo.png';

class Banner extends React.Component {
  render() {
    return (
      <div>
        <img src={logo} alt="VTEX logo"/>
      </div>
    );
  }
}

export default HomePage;
