import React, { Component } from "react";
import "./Home.css";
import Header from "../../common/header/Header";
import RestaurantCard from "./restaurantCard";

class Home extends Component {
  constructor() {
    super();
    this.state = {
      restaurantData: null,
      error: false,
      erorCode: null,
      errorMsg: null
    };
  }
  componentDidMount() {
    this.getRestaurantData("");
  }

  // fetch restaurant data based on search text
  getRestaurantData = (searchText) => {
    var url = this.props.baseUrl + "restaurant";

    if (searchText !== null && searchText.trim() !== "") {
      url += "/name/" + searchText;
    }
    fetch(
      url,
      {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json;charset=UTF-8',
        }
      }
    ).then((response) => {
      if (response.status === 200) {
        response.json().then((json) => {
          this.setState({ restaurantData: json.restaurants });
        })
      } else {
        response.json().then((json) => {
          this.setState({
            error: true,
            erorCode: json.code,
            errorMsg: json.message
          });
        })
      }
    }, error => {
      this.setState({
        error: true,
        erorCode: error.code,
        errorMsg: "Error while making request to FoodOrderingApp Backend"
      });
    })
  }
  render() {
    return (
      <div>
        <Header {...this.props} showSearchBar={true}
          getRestaurantData={this.getRestaurantData} />
        {!this.state.restaurantData ? 
		<div className='response'>
            <p className='line'>No restaurant with the given name.</p>
          </div>
		:
          <RestaurantCard {...this.props} restaurantData={this.state.restaurantData} />
        }
      </div>
    );
  }
}

export default Home;
