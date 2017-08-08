import * as firebase from 'firebase';

import AsyncStorageHelper from './AsyncStorageHelper';
import { FIREBASE_CONFIG, CHAT_TYPES, GENDERS } from '../AppConstants';

import {
    Platform
} from 'react-native';

import RNFetchBlob from 'react-native-fetch-blob'

const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

class FirebaseHelper {

    uid = '';
    roomsRef = null;
    roomRef = null;
    roomMessagesRef = null;
    roomId = 0;

    constructor() {
        firebase.initializeApp(FIREBASE_CONFIG);
        this.roomsRef = firebase.database().ref("rooms");
        this.roomRef = null;
        this.roomMessagesRef = null;
        this.uid = Math.round(Math.random() * 1000000000000000);
        this.roomId = 0;
        this.onConnectCallback = null;
        this.onReceiveMessageCallback = null;
        this.onDisconnectToParnerCallback = null;
    }

    setRoomId(key) {
        this.roomId = key;
    }

    getRoomId() {
        return this.roomId;
    }

    setRoomRef(id) {
        this.roomRef = firebase.database().ref("rooms/" + id);
    }

    getUId() {
        return this.uid;
    }

    uploadImage(uri, mime = 'application/octet-stream') {
        return new Promise((resolve, reject) => {
            const uploadUri = uri;
            let uploadBlob = null;
            const imageRef = firebase.storage().ref().child(`${new Date().getTime()}.jpg`);
            fs.readFile(uploadUri, 'base64').then((data) => {
                return Blob.build(data, { type: `${mime};BASE-64` });
            }).then((blob) => {
                uploadBlob = blob;
                return imageRef.put(blob, { contentType: mime })
            }).then(() => {
                uploadBlob.close();
                const url = imageRef.getDownloadURL();
                return url;
            }).then((url) => {
                resolve(url);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    removeRoom() {
        return this.roomsRef.child(this.getRoomId()).remove();
    }

    removeCurrentUserFromRoom() {
        return new Promise((resolve, reject) => {
            this.roomRef.once('value').then((snapshot) => {
                const data = snapshot.val();
                for (key in data) {
                    if (data[key]._id === this.getUId()) {
                        this.roomRef.child(key).remove(() => {
                            this.roomRef.once('value').then((snapshot) => {
                                const data = snapshot.val();
                                const user = {};
                                if (data) {
                                    if (data.hasOwnProperty('user2')) {
                                        this.roomRef.set({
                                            user1: {
                                                _id: data['user2']._id,
                                                age: data['user2'].age,
                                                gender: data['user2'].gender,
                                            }
                                        }).then(() => resolve());
                                    }
                                } else {
                                    resolve();
                                }
                            });
                        });
                    }
                }
            }).catch((error) => {
                reject(error);
            });
        });
    }

    setOnConnectToPartnerListener(callback) {
        this.onConnectCallback = callback;
        if (this.roomRef) {
            this.roomRef.on('child_added', (snapshot) => {
                const data = snapshot.val();
                if (snapshot.key == 'user2')
                    callback();
            });
        }
    }

    setOnDisconnecToPartnerListener(callback) {
        this.onDisconnectToParnerCallback = callback;
        if (this.roomRef) {
            this.roomRef.on('child_removed', (snapshot) => {
                const data = snapshot.val();
                callback();
            });
        }
    }

    setOnReceiveMessageListener(callback) {
        this.onReceiveMessageCallback = callback;
        if (this.roomMessagesRef) {
            this.roomMessagesRef.on('child_added', (snapshot) => {
                const message = snapshot.val();
                callback({
                    _id: snapshot.key,
                    user: {
                        _id: message.user._id
                    },
                    text: message.text,
                    picture: message.picture
                });
            });
        }
    }

    sendMessage(message) {
        this.roomMessagesRef.push(message);
    }

    setMessagesRoom(key) {
        this.roomMessagesRef = firebase.database().ref('messages/room' + this.getRoomId());
    }

    createNewRoom(age, gender) {
        const self = this;
        this.roomsRef.push({
            user1: {
                _id: this.getUId(),
                age: age,
                gender: gender
            }
        }).then((snap) => {
            const key = snap.key;
            self.setRoomId(key);
            self.setRoomRef(key);
            self.setMessagesRoom(key);
            this.roomRef.on('child_added', (snapshot) => {
                const data = snapshot.val();
                if (snapshot.key == 'user2')
                    this.onConnectCallback();
            });
            this.roomMessagesRef.on('child_added', (snapshot) => {
                const message = snapshot.val();
                this.onReceiveMessageCallback({
                    _id: snapshot.key,
                    user: {
                        _id: message.user._id
                    },
                    text: message.text,
                    picture: message.picture
                });
            });
            this.roomRef.on('child_removed', (snapshot) => {
                const data = snapshot.val();
                this.onDisconnectToParnerCallback();
            });
        });
    }

    addUserToRoom(age, gender) {
        return this.roomRef.update({
            user2: {
                _id: this.getUId(),
                age: age,
                gender: gender
            }
        });
    }

    setRoomReferences(key, age, gender) {
        this.setRoomId(key);
        this.setRoomRef(key);
        this.setMessagesRoom(key);
        this.addUserToRoom(key, age, gender);
    }

    createChat(chat_type, gender, age, age_from, age_to, pref_gender) {
        const self = this;
        return this.roomsRef.once('value').then((snapshot) => {
            const rooms = snapshot.val();
            let roomFound = false;
            if (rooms) {
                for (let key in rooms) {
                    if (rooms.hasOwnProperty(key)) {
                        if (key !== this.getRoomId()) {
                            const val = rooms[key];
                            if (!val.hasOwnProperty('user2')) {
                                const user1 = val['user1'];
                                if (chat_type == CHAT_TYPES.ANONYMOUS) {
                                    if (user1.age >= age_from && user1.age <= age_to && (user1.gender === pref_gender || user1.gender == GENDERS.ANY)) {
                                        self.setRoomReferences(key, age, gender);
                                        roomFound = true;
                                        break;
                                    }
                                } else if (chat_type == CHAT_TYPES.BLIND) {
                                    AsyncStorageHelper.get('last_lady_talk').then((val) => {
                                        if (val !== null) {
                                            const currTime = new Date().getTime();
                                            if (currTime < (parseInt(val) + (24 * 3600))) {
                                                if (user1.gender == GENDERS.MALE) {
                                                    self.setRoomReferences(key, age, gender);
                                                    roomFound = true;
                                                    AsyncStorageHelper.set('last_lady_talk', currTime.toString());
                                                }
                                            } else {
                                                if (user1.gender == GENDERS.FEMALE) {
                                                    self.setRoomReferences(key, age, gender);
                                                    roomFound = true;
                                                }
                                            }
                                        } else if(val == null) {
                                            AsyncStorageHelper.set('last_lady_talk', new Date().getTime().toString()).catch((e) => {
                                                // error
                                            });
                                            if (user1.gender == GENDERS.FEMALE) {
                                                self.setRoomReferences(key, age, gender);
                                                roomFound = true;
                                            }
                                        }
                                    }).catch((e) => {
                                        // error
                                    });
                                }
                            }
                        }

                    }
                }
                if (!roomFound) {
                    self.createNewRoom(age, gender);
                }
            } else {
                self.createNewRoom(age, gender);
            }
        });
    }
}

export default new FirebaseHelper();