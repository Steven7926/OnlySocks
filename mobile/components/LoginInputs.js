import React from 'react';
import {
    AppRegistry,
    StyleSheet,
    TextInput,
    View,
    Alert,
    Button } from 'react-native';

export default class LoginInputs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            TextInputUser: '',
            TextInputPass: '',
        };
    }
    CheckTextInput = () => {
        //Handler for the Submit onPress

        if (this.state.TextInputPass != '' && this.state.TextInputUser != '') {

        }
        if (this.state.TextInputUser == '' && this.state.TextInputUser == '') {
                Alert.alert('Invalid Username/Password', 'Please enter a Username and a Password.');                    
        }         
      
    };
    render() {
        return (
            <View style={{flex:2}}>
                <View style={{ width: 250, marginLeft: 25}}>
                    <TextInput
                        placeholder=" Username..."
                        onChangeText={TextInputUser => this.setState({ TextInputUser })}
                        underlineColorAndroid="transparent"
                        style={styles.userInputs}
                    />
                    <TextInput
                        placeholder=" Password..."
                        onChangeText={TextInputPass => this.setState({ TextInputPass })}
                        underlineColorAndroid="transparent"
                        style={styles.userInputs}
                    />
                </View>
                <View style={{ marginTop: 15, width: 300}}>
                    <Button
                        title="Login"
                        onPress={this.CheckTextInput}
                        color="rgb(199, 97, 86)"
                    />
                </View>
                <View style={{ marginTop: 15, width: 300 }}>
                    <Button
                        title="Sign Up!"
                        color="rgb(199, 97, 86)"
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    userInputs: {
        color: "#ffffff",
        height: 40,
        borderColor: 'gray',
        borderWidth: 3,
        borderRadius: 10,
        marginTop: 10,
        textAlign: 'center'
    }
});