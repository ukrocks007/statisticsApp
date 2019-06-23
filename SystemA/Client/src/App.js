import React, { Component } from '../node_modules/react';
import './App.css';
import {
    Page, Form, Button, Alert
} from 'tabler-react';
import axios from 'axios';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            txtInput: "",
            originalData: "",
            result: [],
            error: "",
            loadingR: false,
            loadingS: false
        }
        this.textBoxChanged = this.textBoxChanged.bind(this);
    }

    textBoxChanged = (e) => {
        if (e.target.value.indexOf('.') === -1) {
            this.setState({
                txtInput: e.target.value
            });
        }
    }

    generateRandomNumbers = async () => {
        this.setState({
            loadingR: true,
            error: "",
            originalData: "",
            result: []
        });
        try {
            let res = await axios.get("http://localhost:3000/actions?method=GEN-RAND&ts=" + (+new Date()));
            this.setState({
                loadingR: false,
                txtInput: res.data.list.toString().replace('[', '').replace(']', '').trim()
            });
        } catch (ex) {
            console.log(ex);
            this.setState({
                error: "Unable to send request!",
                loadingR: false,
                originalData: "",
                result: []
            });
        }
    }

    getStats = async () => {
        this.setState({
            loadingR: true,
            error: "",
            originalData: "",
            result: []
        });
        try {
            let originalData = "[" + this.state.txtInput + "]";
            axios.get("http://localhost:3000/actions?method=IS-VALID-ENTRY&payload={entry:" +
                originalData + "}&ts=" + (+new Date())).then((isValid) => {
                    if (isValid.data) {
                        axios.get("http://localhost:3000/actions?method=CALCULATE-STATS&payload={entry:" + originalData + "}&ts=" + (+new Date())).then((res) => {
                            this.setState({
                                loadingR: false,
                                result: res.data,
                                originalData: originalData
                            });
                        }).catch(err => {
                            this.setState({
                                error: err.response.data.error,
                                loadingR: false,
                                originalData: "",
                                result: []
                            });
                        });
                    }
                }).catch(err => {
                    this.setState({
                        error: err.response.data.error,
                        loadingR: false,
                        originalData: "",
                        result: []
                    });
                });
        } catch (ex) {
            console.log(ex);
            this.setState({
                error: "Unable to send request!",
                loadingR: false,
                originalData: "",
                result: []
            });
        }
    }

    render() {
        return (
            <Page>
                <div className="container">
                    <div className="division">
                        <div className="input-div">
                            <div className="input-label">
                                <h1>Enter list</h1>
                            </div>
                            <div className="input-bar">
                                <Form.Input value={this.state.txtInput} name='number' placeholder='' onChange={this.textBoxChanged} />
                            </div>
                        </div>
                        <div className="button-bar">
                            <div className="message">
                                <h5>Enter comma separated list of numbers</h5>
                            </div>
                            <div className="buttons">
                                <Button.List>
                                    <Button loading={this.state.loadingR} onClick={this.generateRandomNumbers} color="grey">Generate Random Numbers</Button>
                                    <Button loading={this.state.loadingS} onClick={this.getStats} color="primary">Calculate Statistics</Button>
                                </Button.List>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="result">
                        Original data: {this.state.originalData} <br />
                        Mean: {this.state.result ? this.state.result["mean"] : ""} <br />
                        Median: {this.state.result ? this.state.result["median"] : ""} <br />
                        Variance: {this.state.result ? this.state.result["variance"] : ""} <br />
                        Standard Dev: {this.state.result ? this.state.result["std-dev"] : ""} <br />
                        <br />
                        {this.state.error && <Alert type="danger">
                            {this.state.error}
                        </Alert>}
                    </div>
                </div>
            </Page>
        )
    }
}

export default App;
