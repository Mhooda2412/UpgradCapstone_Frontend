import React, { Component } from 'react';
import Modal from '@material-ui/core/Modal';
import './LoginSignupModal.css';
import Button from "@material-ui/core/Button";
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormHelperText from "@material-ui/core/FormHelperText";
import Container from "@material-ui/core/Container";
import Snackbar from '@material-ui/core/Snackbar';

class LoginSignupModal extends Component {
    constructor() {
        super();
        this.state = {
            tab: 'login',
            lUsernameRequired: false,
            lUsername: "",
            lPasswordRequired: false,
            lPassword: "",
            loginError: false,
            loginErrorCode: null,
            loginErrorMsg: null,
            sFirstNameRequired: false,
            sFirstName: "",
            sLastName: "",
            sPasswordRequired: false,
            sPassword: "",
            sEmailRequired: false,
            sEmail: "",
            sContactNoRequired: false,
            sContactNo: "",
            signupError: false,
            signupErrorCode: null,
            signupErrorMsg: null,
            floatingAlert: false,
            floatingAlertMsg: "Registered successfully! Please login now!",
        }
    }
    clearAll() {
        this.setState({
            tab: 'login',
            lUsernameRequired: false,
            lUsername: "",
            lUsernameValidationFailed: false,
            lPasswordRequired: false,
            lPassword: "",
            loginError: false,
            loginErrorCode: null,
            loginErrorMsg: null,
            sFirstNameRequired: false,
            sFirstName: "",
            sLastName: "",
            sPasswordRequired: false,
            sPassword: "",
            sPasswordValidationFailed: false,
            sEmailRequired: false,
            sEmail: "",
            sIsEmailValidationFailed: false,
            sContactNoRequired: false,
            sContactNo: "",
            sContactNoValidationFailed: false,
            signupError: false,
            signupErrorCode: null,
            signupErrorMsg: null,
            floatingAlert: false
        })
    }
    tabChange = (event, newValue) => {
        document.getElementById("container-" + this.state.tab + "-form").style.display = 'none';
        this.setState({ tab: newValue });
        document.getElementById("container-" + newValue + "-form").style.display = 'block';


    }
    closeFloatingAlert = () => {
        this.setState({ floatingAlert: false });
    }

    commonInputChangeHandler = e => {
        var stateName = e.target.id;
        var requiredflag = e.target.id + 'Required';
        var requiredflagVal = false;
        if (!e.target.value) {
            requiredflagVal = true;
        } else {
            requiredflagVal = false;
        }
        this.setState({
            [stateName]: e.target.value,
            [requiredflag]: requiredflagVal
        });
    }
    isValidContactNo = (contactNumber) => {
        var format = /^\d{10}$/;
        if (contactNumber.match(format)) {
            return true;
        } else {
            return false;
        }
    }
    isValidPassword = (password) => {
        //min 8 char long, 1 digit, 1 uppercase letter, 1 special character in [#@$%&*!^], total of 8 characters
        var containdigit = false;
        var containUpperCaseChar = false;
        var containSpecialChar = false;

        if (password.length < 8) {
            return false;
        }

        for (var i = 0; i < password.length; i++) {

            var c = password[i];

            if (c >= '0' && c <= '9') {
                containdigit = true;
            } else if (c >= 'A' && c <= 'Z') {
                containUpperCaseChar = true;
            } else if (['#', '@', '$', '%', '&', '*', '!', '^'].indexOf(c) !== -1) {
                containSpecialChar = true;
            }

            if (containdigit & containUpperCaseChar & containSpecialChar) {
                return true;
            }
        }

        return false;
    }
    isValidEmail = (email) => {
        var format = /^[a-zA-Z0-9]{3,}@[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}$/;
        if (email.match(format)) {
            return true;
        } else {
            return false;
        }
    }
    loginClickHandler = () => {

        if (this.state.lUsername === null || this.state.lUsername === "") {
            this.setState({ lUsernameRequired: true });
        } else if (!this.isValidContactNo(this.state.lUsername)) {
            this.setState({ lUsernameValidationFailed: true });
        } else {
            this.setState({
                lUsernameRequired: false,
                lUsernameValidationFailed: false
            });
        }

        if (this.state.lPassword === null || this.state.lPassword === "") {
            this.setState({ lPasswordRequired: true });
        } else {
            this.setState({ lPasswordRequired: false });
        }

        if (this.state.lUsername !== "" && this.state.lPassword !== "") {
            this.setState({
                loginError: false,
                loginErrorCode: null,
                loginErrorMsg: null
            });
            fetch(
                this.props.baseUrl + "customer/login",
                {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                        'Accept': 'application/json;charset=UTF-8',
                        'authorization': 'Basic ' + btoa(this.state.lUsername + ':' + this.state.lPassword),
                    }
                }
            ).then((response) => {
                if (response.status === 200) {
                    response.json().then((json) => {
                        var firstName = "";
                        Object.keys(json).forEach(function (key) {
                            if (key === 'first_name') {
                                firstName = json[key]
                            }
                            sessionStorage.setItem(key, json[key]);
                        })
                        this.props.onCloseLoginSignupModal(firstName);
                    })
                    response.headers.forEach((val, key) => {
                        if (key === "access-token") {
                            sessionStorage.setItem("access-token", val);
                        }
                    })
                    this.clearAll();
                } else {
                    response.json().then((json) => {
                        this.setState({
                            loginError: true,
                            loginErrorCode: json.code,
                            loginErrorMsg: json.message
                        });

                    })
                }
            }, error => {
                this.setState({
                    loginError: true,
                    loginErrorCode: error,
                    loginErrorMsg: "Error while making request to FoodOrderingApp Backend"
                });
            })
        }
    }
    signupClickHandler = () => {

        if (this.state.sFirstName === null || this.state.sFirstName === "") {
            this.setState({ sFirstNameRequired: true });
        } else {
            this.setState({ sFirstNameRequired: false });
        }

        if (this.state.sEmail === null || this.state.sEmail === "") {
            this.setState({ sEmailRequired: true });
        } else if (!this.isValidEmail(this.state.sEmail)) {
            this.setState({ sEmailValidationFailed: true });
        } else {
            this.setState({
                sEmailRequired: false,
                sEmailValidationFailed: false
            });
        }

        if (this.state.sPassword === null || this.state.sPassword === "") {
            this.setState({ sPasswordRequired: true });
        } else if (!this.isValidPassword(this.state.sPassword)) {
            this.setState({ sPasswordValidationFailed: true });
        } else {
            this.setState({
                sPasswordRequired: false,
                sPasswordValidationFailed: false
            });
        }

        if (this.state.sContactNo === null || this.state.sContactNo === "") {
            this.setState({ sContactNoRequired: true });
        } else if (!this.isValidContactNo(this.state.sContactNo)) {
            this.setState({ sContactNoValidationFailed: true });
        } else {
            this.setState({
                sContactNoRequired: false,
                sContactNoValidationFailed: false
            });
        }

        if (this.state.sFirstName !== "" && this.state.sEmailRequired !== "" && this.state.sPassword !== "" && this.state.sContactNo !== "") {
            this.setState({
                signupError: false,
                signupErrorCode: null,
                signupErrorMsg: null
            });
            fetch(
                this.props.baseUrl + "customer/signup",
                {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                        'Accept': 'application/json;charset=UTF-8',
                    },
                    body: JSON.stringify({
                        'contact_number': this.state.sContactNo,
                        'email_address': this.state.sEmail,
                        'first_name': this.state.sFirstName,
                        'last_name': this.state.sLastName,
                        'password': this.state.sPassword
                    })
                }
            ).then((response) => {
                if (response.status === 201) {
                    this.clearAll();
                    document.getElementById("container-signup-form").style.display = 'none';
                    document.getElementById("container-login-form").style.display = 'block';
                    this.setState({ floatingAlert: true });
                } else {
                    response.json().then((json) => {
                        this.setState({
                            signupError: true,
                            signupErrorCode: json.code,
                            signupErrorMsg: json.message
                        });

                    })
                }
            }, error => {
                this.setState({
                    loginError: true,
                    loginErrorCode: error,
                    loginErrorMsg: "Error while making request to FoodOrderingApp Backend"
                });
            })
        }
    }
    render() {
        return (
            <div>
                <Modal disableEnforceFocus
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.props.openLoginSignupModal}
                    onClose={this.props.onCloseLoginSignupModal}
                    onBackdropClick={this.props.onCloseLoginSignupModal}>
                    <div class="modal-div">
                        <Tabs value={this.state.tab} indicatorColor="primary" textColor="primary"
                            aria-label="disabled tabs example" defaultActiveKey='Login' onChange={(evt, value) => this.tabChange(evt, value)} >
                            <Tab label="Login" value={'login'} eventKey="login" />
                            <Tab label="Signup" value={'signup'} eventKey="Signup" />
                        </Tabs>
                        {/******************* Login Form *******************/}
                        <Container id="container-login-form"  >
                            <FormControl className="login-signup-form" required>
                                <InputLabel htmlFor="lUsername">Contact No.</InputLabel>
                                <Input id="lUsername" type="text" value={this.state.lUsername} onChange={this.commonInputChangeHandler} />
                                {this.state.lUsernameRequired ? (
                                    <FormHelperText>
                                        <span className="red">required</span>
                                    </FormHelperText>
                                ) : this.state.lUsernameValidationFailed ? (
                                    <FormHelperText>
                                        <span className="red">Invalid Contact</span>
                                    </FormHelperText>
                                ) : null}
                            </FormControl><br /><br />
                            <FormControl className="login-signup-form" required>
                                <InputLabel htmlFor="lPassword">Password</InputLabel>
                                <Input id="lPassword" type="password" value={this.state.lPassword} onChange={this.commonInputChangeHandler} />
                                {this.state.lPasswordRequired ? (
                                    <FormHelperText>
                                        <span className="red">required</span>
                                    </FormHelperText>
                                ) : null}
                            </FormControl><br /><br />
                            {this.state.loginError ? (
                                <FormHelperText>
                                    <span className="red">
                                        {this.state.loginErrorMsg}
                                    </span>
                                </FormHelperText>
                            ) : null}
                            <br />
                            <Container className="login-button-container">
                                <Button className="login-button"variant="contained" color="primary"onClick={this.loginClickHandler} >
                                    LOGIN
								</Button>
                            </Container>
                            <br />
                        </Container>

                        {/******************* Signup Form *******************/}
                        <Container id="container-signup-form" >
                            <FormControl className="login-signup-form" required>
                                <InputLabel htmlFor="sFirstName">First Name</InputLabel>
                                <Input
                                    id="sFirstName"
                                    type="text"
                                    value={this.state.sFirstName}
                                    onChange={this.commonInputChangeHandler}
                                />
                                {this.state.sFirstNameRequired ? (
                                    <FormHelperText>
                                        <span className="red">required</span>
                                    </FormHelperText>
                                ) : null}
                            </FormControl><br /><br />
                            <FormControl className="login-signup-form">
                                <InputLabel htmlFor="sLastName">Last Name</InputLabel>
                                <Input id="sLastName" type="text" value={this.state.sLastName} onChange={this.commonInputChangeHandler} />
                            </FormControl><br /><br />
                            <FormControl className="login-signup-form" required>
                                <InputLabel htmlFor="sEmail">Email</InputLabel>
                                <Input
                                    id="sEmail"
                                    type="text"
                                    value={this.state.sEmail}
                                    onChange={this.commonInputChangeHandler}
                                />
                                {this.state.sEmailRequired ? (
                                    <FormHelperText>
                                        <span className="red">required</span>
                                    </FormHelperText>
                                ) : this.state.sEmailValidationFailed ? (
                                    <FormHelperText>
                                        <span className="red">Invalid Email</span>
                                    </FormHelperText>
                                ) : null}
                            </FormControl><br /><br />
                            <FormControl className="login-signup-form" required>
                                <InputLabel htmlFor="sPassword">Password</InputLabel>
                                <Input id="sPassword" type="password" value={this.state.sPassword} onChange={this.commonInputChangeHandler} />
                                {this.state.sPasswordRequired ? (
                                    <FormHelperText>
                                        <span className="red">required</span>
                                    </FormHelperText>
                                ) : this.state.sPasswordValidationFailed ? (
                                    <FormHelperText>
                                        <span className="red">Password must contain at least one capital letter, one small letter, one number, and one special character</span>
                                    </FormHelperText>
                                ) : null}
                            </FormControl><br /><br />
                            <FormControl className="login-signup-form" required>
                                <InputLabel htmlFor="sContactNo">Contact No.</InputLabel>
                                <Input id="sContactNo" type="text" value={this.state.sContactNo} onChange={this.commonInputChangeHandler} />
                                {this.state.sContactNoRequired ? (
                                    <FormHelperText>
                                        <span className="red">required</span>
                                    </FormHelperText>
                                ) : this.state.sContactNoValidationFailed ? (
                                    <FormHelperText>
                                        <span className="red">Contact No. must contain only numbers and must be 10 digits long</span>
                                    </FormHelperText>
                                ) : null}
                            </FormControl>
                            <br />
                            <br />
                            {this.state.signupError ? (
                                <FormHelperText>
                                    <span className="red">
                                        {this.state.signupErrorMsg}
                                    </span>
                                </FormHelperText>
                            ) : null}
                            <br />
                            <Container className="signup-button-container">
                                <Button className="signup-button" variant="contained" color="primary" onClick={this.signupClickHandler} >
                                    SIGNUP
                                </Button>
                            </Container><br />
                        </Container>
                    </div>
                </Modal>
                <Snackbar open={this.state.floatingAlert}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    autoHideDuration={6000}
                    onClose={this.closeFloatingAlert}
                    message={this.state.floatingAlertMsg} />
            </div>
        );
    }
}

export default LoginSignupModal;
