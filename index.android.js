import {Navigation} from 'react-native-navigation';
import {registerScreens} from './src/api/RegisterScreens';
import {SCREENS} from './src/AppConstants';

registerScreens();

Navigation.startSingleScreenApp({
  screen: SCREENS.HOME_SCREEN
});