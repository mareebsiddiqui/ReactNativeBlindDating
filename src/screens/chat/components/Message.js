import React from 'react';

import {
    View,
    Text,
    Image
} from 'react-native';

import FitImage from 'react-native-fit-image';

import { style } from './styles/MessageStyles.js';

export default class Message extends React.Component {

    render() {
        return (
            <View style={{ paddingHorizontal: 10 }}>
                {this.props.userId !== this.props.user._id &&
                    <View style={style.bubble}>
                        <View>
                            {this.props.picture &&
                                <View style={[style.bubbleLeft, style.maxWidth]}>
                                    <FitImage source={{ uri: this.props.picture }} />
                                </View>
                            }
                            {!this.props.picture &&
                                <View style={[style.bubbleLeft]}>
                                    <Text style={[style.left]}>{this.props.text}</Text>
                                </View>
                            }
                            <View style={{ flex: 1 }}>
                            </View>
                        </View>
                    </View>
                }
                {this.props.userId === this.props.user._id &&
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                        </View>
                        {this.props.picture &&
                            <View style={[style.bubbleRight, style.maxWidth]}>
                                <FitImage source={{ uri: this.props.picture }} />
                            </View>
                        }
                        {!this.props.picture &&
                            <View style={[style.bubbleRight]}>
                                <Text style={[style.right, style.white]}>{this.props.text}</Text>
                            </View>
                        }
                    </View>
                }
            </View>
        );
    }

}