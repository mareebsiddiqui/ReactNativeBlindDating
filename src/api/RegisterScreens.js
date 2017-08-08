import {Navigation} from 'react-native-navigation';

import HomeScreen from '../screens/home/HomeScreen';
import BlindDateScreen from '../screens/blind_date/BlindDateScreen';
import ChatNowScreen from '../screens/chat_now/ChatNowScreen';
import ChatScreen from '../screens/chat/ChatScreen';

export function registerScreens() {
    Navigation.registerComponent('home_screen', () => HomeScreen);
    Navigation.registerComponent('blind_date_screen', () => BlindDateScreen);
    Navigation.registerComponent('chat_now_screen', () => ChatNowScreen);
    Navigation.registerComponent('chat_screen', () => ChatScreen);
}