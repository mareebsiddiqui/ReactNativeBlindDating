const NavbarStyle = {
    navBarBackgroundColor: 'rgba(16.5,26.7,50.6,0.85)',
    navBarTextColor: 'white',
    navBarButtonColor: 'white'
};

export const SCREENS = {
    get CHAT_SCREEN() {
        return {
            screen: 'chat_screen',
            title: 'Chat',
            navigatorStyle: NavbarStyle
        }
    },

    get HOME_SCREEN() {
        return {
            screen: 'home_screen',
            title: 'Home'
        }
    },

    get BLIND_DATE_SCREEN() {
        return {
            screen: 'blind_date_screen',
            title: 'Blind Dating',
            navigatorStyle: NavbarStyle
        }
    },

    get CHATNOW_SCREEN() {
        return {
            screen: 'chat_now_screen',
            title: 'Chat Now',
            navigatorStyle: NavbarStyle
        }
    }
}

export const FIREBASE_CONFIG = {
    apiKey: "AIzaSyAwLpR5oSGOvNCqO8rf_GmdHEDuUFWVwTw",
    authDomain: "abhijeetchat-f.firebaseapp.com",
    databaseURL: "https://abhijeetchat-f.firebaseio.com",
    projectId: "abhijeetchat-f",
    storageBucket: "abhijeetchat-f.appspot.com",
    messagingSenderId: "1087627998137"
};

export const CHAT_TYPES = {
    ANONYMOUS: 0,
    BLIND: 1
}

export const GENDERS = {
    MALE: 0,
    FEMALE: 1,
    ANY: 2
}