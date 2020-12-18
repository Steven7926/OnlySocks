import React from 'react';
import { StyleSheet, View, Animated, Image, Easing } from 'react-native';

export default class ImageRotating extends React.Component {
    constructor() {
        super();
        this.RotateValueHolder = new Animated.Value(0);
    }
    componentDidMount() {
        this.StartImageRotateFunction();
    }
    StartImageRotateFunction() {
        this.RotateValueHolder.setValue(0);
        Animated.timing(this.RotateValueHolder, {
            toValue: 1,
            duration: 14000,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start(() => this.StartImageRotateFunction());
    }
    render() {
        const RotateData = this.RotateValueHolder.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
        });
        return (
            <View>
                <Animated.Image
                    style={{
                        width: 200,
                        height: 200,
                        transform: [{ rotate: RotateData }],
                    }}
                    source={require('./sock.png')}
                />
            </View>
        );
    }
}
