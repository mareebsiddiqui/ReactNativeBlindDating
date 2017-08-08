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

import FirebaseHelper from '../../api/FirebaseHelper';

export default class ChatNowScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gender_options: [
                { label: 'Male      ', value: GENDERS.MALE },
                { label: 'Female      ', value: GENDERS.FEMALE },
            ],
            pref_gender_options: [
                { label: 'Male      ', value: GENDERS.MALE },
                { label: 'Female      ', value: GENDERS.FEMALE },
                { label: 'Any', value: GENDERS.ANY }
            ],
            age: '18',
            gender: 0,
            age_from: '17',
            age_to: '20',
            pref_gender: 0
        }
        this.find_partner = this.find_partner.bind(this);
    }

    find_partner() {
        Alert.alert('Creating Room','Please wait...', null, {cancelable: false});
        const self = this;
        FirebaseHelper.createChat(CHAT_TYPES.ANONYMOUS, this.state.gender, this.state.age, this.state.age_from, this.state.age_to, this.state.pref_gender).then(() => {
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
                    age: self.state.age, 
                    age_from: self.state.age_from, 
                    age_to: self.state.age_to, 
                    pref_gender: self.state.pref_gender
                }
            });
        }).catch((error) => {
            console.error(error);
        });
    }

    render() {
        return (
            <View style={ScreenStyles.container}>
                <View style={ScreenStyles.row}>
                    <Text style={ScreenStyles.heading}>I am...</Text>
                    <RadioForm
                        radio_props={this.state.gender_options}
                        initial={0}
                        formHorizontal={true}
                        labelHorizontal={true}
                        buttonColor={'#2196f3'}
                        animation={true}
                        onPress={(gender) => { this.setState({ gender }) }}
                        style={{ marginBottom: 5 }}
                    />
                    <TextInput placeholder="Age.." value={this.state.age} onChangeText={(age) => this.setState({ age })} style={ScreenStyles.input} />
                </View>
                <View style={ScreenStyles.row}>
                    <Text style={ScreenStyles.heading}>Looking for...</Text>
                    <RadioForm
                        radio_props={this.state.pref_gender_options}
                        initial={0}
                        formHorizontal={true}
                        labelHorizontal={true}
                        buttonColor={'#2196f3'}
                        animation={true}
                        onPress={(pref_gender) => { this.setState({ pref_gender }) }}
                        style={{ marginBottom: 5 }}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <TextInput placeholder="22" value={this.state.age_from} onChangeText={(age_from) => this.setState({ age_from })} style={{ flex: 1 }} />
                        <Text style={{ flex: 1, textAlign: 'center', fontSize: 50 }}> ~ </Text>
                        <TextInput placeholder="28" value={this.state.age_to} onChangeText={(age_to) => this.setState({ age_to })} style={{ flex: 1 }} />
                    </View>
                </View>
                <View style={ScreenStyles.row}>
                    <Button
                        containerStyle={ButtonStyles.buttonContainer}
                        style={ButtonStyles.button}
                        onPress={this.find_partner}>
                        Find Partner
                    </Button>
                </View>
            </View>
        );
    }
}