import {
    AsyncStorage
} from 'react-native';

class AsyncStorageHelper {
    
    set(key, val) {
        
        try {
            return AsyncStorage.setItem(key, val);
        } catch(e) {
            return e;
        }

    }

    get(key) {

        try {
            return AsyncStorage.getItem(key);
        } catch(e) {
            return e;
        }

    }

}

export default new AsyncStorageHelper();