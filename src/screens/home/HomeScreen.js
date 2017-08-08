import React, { Component } from 'react';
import {
  Image,
  View,
  Text,
  Picker,
  TextInput
} from 'react-native';
import Button from 'react-native-button';
import LinearGradient from 'react-native-linear-gradient';

import {SCREENS} from '../../AppConstants';

import { ButtonStyles } from '../../AppStyles';
import { style } from './styles/Style.js';

export default class HomeScreen extends Component {

  static navigatorStyle = {
    navBarHidden: true
  }

  constructor(props) {
    super(props);
    this.state = {
      gender: ''
    };
  }

  redirectTo(screen) {
    switch (screen) {
      case 'blind_date_screen':
        this.props.navigator.push(SCREENS.BLIND_DATE_SCREEN)
        break;
      
      case 'chat_now_screen':
        this.props.navigator.push(SCREENS.CHATNOW_SCREEN)
        break;

      default:
        break;
    }
    
  }

  render() {
    return (
      <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={style.backgroundImage}>
        <View style={{marginBottom: 20}}>
          <Text style={style.heading}>CHATONYMOUS</Text>
        </View>
        <View style={{paddingTop: 150}} />
        <Button
          containerStyle={ButtonStyles.buttonContainer}
          style={ButtonStyles.button}
          onPress={() => this.redirectTo('blind_date_screen')}>
          Blind Dating
        </Button>
        <View style={{ padding: 5 }} />
        <Button
          containerStyle={ButtonStyles.buttonContainer}
          style={ButtonStyles.button}
          onPress={() => this.redirectTo('chat_now_screen')}>
          Chat Now
        </Button>
      </LinearGradient>
    );
  }
}