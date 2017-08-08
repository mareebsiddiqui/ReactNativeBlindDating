import React, { Component } from 'react';
import {
    View,
    TextInput,
    ListView,
    Text
} from 'react-native';

import Button from 'react-native-button';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import PopupDialog, { DialogTitle, DialogButton } from 'react-native-popup-dialog';
import CameraRollPicker from 'react-native-camera-roll-picker';
import BackgroundTimer from 'react-native-background-timer';

import Icon from 'react-native-vector-icons/Entypo';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { SCREENS, CHAT_TYPES } from '../../AppConstants.js';
import FirebaseHelper from '../../api/FirebaseHelper';
import Message from './components/Message';

export default class ChatScreen extends Component {

    ds = null

    constructor(props) {
        super(props);
        ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1._id !== r2._id });
        this.state = {
            msg: "",
            messages: [],
            messagesDataSource: ds.cloneWithRows([]),
            editable: false,
            picture: null
        }
        this.sendMessage = this.sendMessage.bind(this);
        this.onReceiveMessage = this.onReceiveMessage.bind(this);
        this.onConnectToPartner = this.onConnectToPartner.bind(this);
        this.getSelectedImage = this.getSelectedImage.bind(this);
        this.connectToNewPartner = this.connectToNewPartner.bind(this);
        this.onDisconnectToPartner = this.onDisconnectToPartner.bind(this);
        this.startTimeout = this.startTimeout.bind(this);

        this.actionsPopupDialog = null;
        this.chooseImagePopupDialog = null;
        this.timeout = null;
    }

    sendMessage() {
        if (this.state.msg || this.state.picture) {
            let message = {
                user: {
                    _id: FirebaseHelper.getUId()
                },
                text: this.state.msg,
                picture: this.state.picture
            }
            FirebaseHelper.sendMessage(message);

            this.setState({ msg: '', picture: null });
        }
    }

    componentDidMount() {
        FirebaseHelper.setOnReceiveMessageListener(this.onReceiveMessage);
        FirebaseHelper.setOnConnectToPartnerListener(this.onConnectToPartner);
        FirebaseHelper.setOnDisconnecToPartnerListener(this.onDisconnectToPartner);

        this.startTimeout();
    }

    startTimeout() {
        var self = this;
        self.timeout = setTimeout(() => {
            FirebaseHelper.removeRoom().then(() => {
                self.props.navigator.resetTo(SCREENS.HOME_SCREEN);
            }).catch((error) => {
                alert(error.message);
            });
        }, 1000*60);
    }

    onConnectToPartner() {
        this.setState({
            editable: true,
        });
        clearTimeout(this.timeout);
    }

    onDisconnectToPartner() {
        this.setState({
            editable: false,
            messagesDataSource: ds.cloneWithRows([])
        });
        this.startTimeout();
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    onReceiveMessage(msg) {
        let msgs = this.state.messages;
        console.log(msg);
        msgs.push(msg);
        this.setState((prevState) => {
            return {
                messages: msgs,
            }
        });
        var rows = this.state.messages;
        var rowIds = rows.map((row, index) => index).reverse();
        this.setState({
            messagesDataSource: ds.cloneWithRows(this.state.messages, rowIds),
        });
    }

    openActions() {
        this.actionsPopupDialog.show();
    }

    getSelectedImage(images, current) {
        this.chooseImagePopupDialog.dismiss();
        FirebaseHelper.uploadImage(current.uri).then((url) => {
            this.setState({ picture: url });
            this.sendMessage();
        }).catch((error) => {
            console.log(error);
        });
    }

    connectToNewPartner() {
        const props = this.props;
        this.setState({
            editable: false
        });
        FirebaseHelper.removeCurrentUserFromRoom().then(() => {
            if(props.age_from && props.age_to && props.pref_gender) {
                FirebaseHelper.createChat(CHAT_TYPES.ANONYMOUS, props.gender, props.age, props.age_from, props.age_to, props.pref_gender).then(() => {
                    this.actionsPopupDialog.dismiss();
                });
            } else {
                FirebaseHelper.createChat(CHAT_TYPES.BLIND, props.gender, props.age).then(() => {
                    this.actionsPopupDialog.dismiss();
                });
            }
            
        }).catch((error) => {
            alert(error.message);
        });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {!this.state.editable ? (
                    <Text style={{ textAlign: 'center', fontSize: 17 }}>Waiting to connect to partner...</Text>
                ) : (
                        <Text style={{ textAlign: 'center', fontSize: 17 }}>Connected!</Text>
                    )
                }
                <View style={{ flex: 1 }}>
                    <ListView
                        renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
                        dataSource={this.state.messagesDataSource}
                        renderRow={(rowData) => <Message {...rowData} userId={FirebaseHelper.getUId()}></Message>}
                        enableEmptySections={true}
                    />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <EvilIcon name="plus" size={30} style={{ padding: 5, fontWeight: 'bold' }} color="black" onPress={() => this.actionsPopupDialog.show()} />
                    <Icon name="camera" size={25} style={{ padding: 5 }} onPress={() => this.chooseImagePopupDialog.show()} />
                    <TextInput value={this.state.msg} editable={this.state.editable} style={{
                        flex: 1, padding: 5,
                        fontSize: 16,
                        lineHeight: 16,
                        backgroundColor: 'white'
                    }} onChangeText={(msg) => this.setState({ msg })} />
                    <MaterialIcon name="send" size={25} style={{ padding: 5 }} onPress={this.sendMessage} />
                </View>
                <PopupDialog
                    ref={(popupDialog) => { this.actionsPopupDialog = popupDialog; }}
                    dialogTitle={
                        <DialogTitle title="Select Action" />
                    }
                    width="90%"
                    height={200}
                    actions={
                        [
                            <DialogButton text="New Connect" onPress={this.connectToNewPartner} />,
                            <DialogButton text="Report Bad User" onPress={() => this.props.navigator.resetTo(SCREENS.HOME_SCREEN)} />,
                        ]
                    }
                />
                <PopupDialog
                    ref={(popupDialog) => { this.chooseImagePopupDialog = popupDialog; }}
                    dialogTitle={
                        <DialogTitle title="Choose Photo" />
                    }
                >
                    <CameraRollPicker
                        callback={this.getSelectedImage}
                        maximum={1} />
                </PopupDialog>

            </View>
        );
    }
}
