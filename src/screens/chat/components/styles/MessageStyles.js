import {
    StyleSheet,
    Dimensions
} from 'react-native';

const {width, height} = Dimensions.get('window');

export const style = StyleSheet.create({
    bubble: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        minHeight: 20
    },

    bubbleLeft: {
        minWidth: 100,
        maxWidth: width/2,
        backgroundColor: '#e1f7d9',
        padding: 10,
        borderRadius: 4,
        marginVertical: 10,
    },

    bubbleRight: {
        backgroundColor: '#0084ff',
        padding: 10,
        borderRadius: 4,
        marginVertical: 10,
        minWidth: 100,
        maxWidth: width/2
    },

    white: {
        color: 'white'
    },

    maxWidth: {
        minWidth: width/2
    },

    left: {
        textAlign: 'left'
    },

    right: {
        textAlign: 'right'
    }
});