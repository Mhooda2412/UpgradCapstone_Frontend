import React, { Component } from "react";
import "./Home.css";
import Header from "../../common/header/Header";

class Home extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div>
        <Header {...this.props} showSearchBar={true} />
      </div>
    );
  }
}

export default Home;
