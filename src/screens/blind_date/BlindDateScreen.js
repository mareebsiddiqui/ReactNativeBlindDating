import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    Alert
} from 'react-native';
import Button from 'react-native-button';
import RadioForm from 'react-native-simple-radio-button';

import { SCREENS, CHAT_TYPES, GENDERS } from '../../AppConstants';

import { ScreenStyles, ButtonStyles } from '../../AppStyles';
import { style } from './styles/Style';

import FirebaseHelper from '../../api/FirebaseHelper';

export default class BlindDateScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gender: 0,
            radio_props: [
                { label: 'Male      ', value: GENDERS.MALE },
                { label: 'Female', value: GENDERS.FEMALE }
            ],
            age: ''
        }
        this.find_partner = this.find_partner.bind(this);
    }

    find_partner() {
        Alert.alert('Creating Room','Please wait...', null, {cancelable: false});
        const self = this;
        FirebaseHelper.createChat(CHAT_TYPES.BLIND, this.state.gender, this.state.age).then(() => {
            this.props.navigator.resetTo({
                screen: 'chat_screen',
                title: 'Chat',
                navigatorStyle: {
                    navBarBackgroundColor: 'rgba(16.5,26.7,50.6,0.85)',
                    navBarTextColor: 'white',
                    navBarButtonColor: 'white'
                },
                passProps: {
                    gender: self.state.gender, 
                    age: self.state.age
                }
            });
        }).catch((error) => {
            console.error(error);
        });
    }

    render() {
        return (
            <View style={ScreenStyles.container}>
                <Text style={ScreenStyles.heading}>Tell us a bit about yourself:</Text>
                <View style={{padding: 50}} />
                <RadioForm
                    radio_props={this.state.radio_props}
                    initial={0}
                    formHorizontal={true}
                    labelHorizontal={true}
                    buttonColor={'#2196f3'}
                    animation={true}
                    onPress={(gender) => { this.setState({ gender }) }}
                />
                <TextInput placeholder="Age.." value={this.state.age} onChangeText={(age) => this.setState({ age })} style={ScreenStyles.input} />
                <Button
                    containerStyle={[ButtonStyles.buttonContainer, {marginTop: 50}]}
                    style={ButtonStyles.button}
                    onPress={this.find_partner}>
                    Find Partner
                </Button>
            </View>
        );
    }
}