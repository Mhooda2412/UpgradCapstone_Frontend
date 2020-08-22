import React, { Component } from "react";
import "./Profile.css";
import Header from "../../common/header/Header";

class Profile extends Component {
  // if token is null then it redirect to the home page
  componentDidMount() {
    if (sessionStorage.getItem("access-token") === null) {
      this.props.history.push('/');
    }
  }
  render() {
    return (
      <div>
        <Header {...this.props} showSearchBar={false} />
		<h1> This is the profile page </h1> 
      </div>
    );
  }
}

export default Profile;
