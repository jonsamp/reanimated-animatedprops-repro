import React from 'react';
import {StyleSheet, View, TextInput, Dimensions} from 'react-native';

import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useAnimatedProps,
  runOnJS,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';

const screenWidth = Dimensions.get('screen').width;

const SLIDER_WIDTH = screenWidth * 0.9;
const KNOB_WIDTH = 70;
const MAX_RANGE = 100;
const sliderRange = SLIDER_WIDTH - KNOB_WIDTH;
const oneStepValue = sliderRange / MAX_RANGE;

Animated.addWhitelistedNativeProps({text: true});
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

function getStepValue(value) {
  return Math.ceil(value / oneStepValue);
}

function getXValue(value) {
  return Math.floor(value * oneStepValue);
}

function log(value) {
  console.log(getStepValue(value));
}

export default function Slider1() {
  const translateX = useSharedValue(getXValue(16));
  const isSliding = useSharedValue(false);

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (_, ctx: {offsetX: number}) => {
      ctx.offsetX = translateX.value;
      isSliding.value = true;
    },
    onActive: (event, ctx) => {
      translateX.value = Math.min(
        Math.max(event.translationX + ctx.offsetX, 0),
        SLIDER_WIDTH - KNOB_WIDTH,
      );
    },
    onEnd: (event, ctx) => {
      isSliding.value = false;
      runOnJS(log)(
        Math.min(
          Math.max(event.translationX + ctx.offsetX, 0),
          SLIDER_WIDTH - KNOB_WIDTH,
        ),
      );
    },
  });

  const scrollTranslationStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateX.value},
        {
          scale: withTiming(isSliding.value ? 1.1 : 1, {
            duration: 100,
            easing: Easing.linear,
          }),
        },
      ],
    };
  }, [translateX]);

  const stepText = useDerivedValue(() => {
    const step = Math.ceil(translateX.value / oneStepValue);

    return String(step);
  });

  const animatedProps = useAnimatedProps(() => {
    return {
      text: stepText.value,
    };
  });

  return (
    <View style={styles.container}>
      <AnimatedTextInput
        underlineColorAndroid="transparent"
        editable={false}
        style={{fontSize: 40, marginBottom: 40, fontWeight: 'bold'}}
        animatedProps={animatedProps}
        value={stepText.value}
      />
      <View style={styles.slider}>
        <PanGestureHandler onGestureEvent={onGestureEvent}>
          <Animated.View style={[styles.knob, scrollTranslationStyle]} />
        </PanGestureHandler>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    alignItems: 'center',
  },
  slider: {
    height: KNOB_WIDTH / 2,
    width: SLIDER_WIDTH,
    borderRadius: KNOB_WIDTH / 2,
    backgroundColor: '#ddd',
    justifyContent: 'center',
  },
  knob: {
    height: KNOB_WIDTH,
    width: KNOB_WIDTH,
    borderRadius: KNOB_WIDTH / 2,
    backgroundColor: '#757de8',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
