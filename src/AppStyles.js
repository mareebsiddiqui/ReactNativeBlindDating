import {
    StyleSheet
} from 'react-native';

export const ScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 50
    },

    row: {
        alignSelf: 'stretch',
        marginVertical: 20
    },

    heading: {
        marginBottom: 20,
        fontSize: 20
    },

    input: {
        alignSelf: 'stretch',
    }
});

export const ButtonStyles = StyleSheet.create({
    buttonContainer: {
        padding: 5,
        height: 45,
        overflow: 'hidden',
        borderRadius: 2,
        backgroundColor: 'rgba(0,0,0,0.3)',
        width: 250,
        justifyContent: 'center',
        // borderStyle: 'solid',
        // borderWidth: 1,
        // borderColor: 'white'
    },

    button: {
        color: "white",
        // fontFamily: 'Metro-Cond-Black',
        fontSize: 17
    }
});