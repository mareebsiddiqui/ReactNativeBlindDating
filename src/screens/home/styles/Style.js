import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: null,
        height: null,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    
    heading: {
        color: 'white',
        fontSize: 25,
        height: 40,
        // fontFamily: 'Metro-Cond-Black',
        fontWeight: 'bold'
    },

    tagline: {
        color: 'white',
        fontFamily: 'Metro-Cond-Black',
        fontStyle: 'italic',
        alignSelf: 'center',
    }
});