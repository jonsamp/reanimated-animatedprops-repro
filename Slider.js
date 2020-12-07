import React from 'react';
import {StyleSheet, View, TextInput} from 'react-native';

import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useAnimatedProps,
} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';

const SLIDER_WIDTH = 300;
const KNOB_WIDTH = 70;
const MAX_RANGE = 20;

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function Slider1() {
  const translateX = useSharedValue(0);

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (_, ctx: {offsetX: number}) => {
      ctx.offsetX = translateX.value;
    },
    onActive: (event, ctx) => {
      translateX.value = Math.min(
        Math.max(event.translationX + ctx.offsetX, 0),
        SLIDER_WIDTH - KNOB_WIDTH,
      );
    },
  });

  const scrollTranslationStyle = useAnimatedStyle(() => {
    return {transform: [{translateX: translateX.value}]};
  });

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: translateX.value + KNOB_WIDTH,
    };
  });

  const stepText = useDerivedValue(() => {
    const sliderRange = SLIDER_WIDTH - KNOB_WIDTH;
    const oneStepValue = sliderRange / MAX_RANGE;
    const step = Math.ceil(translateX.value / oneStepValue);

    return String(step);
  });

  const animatedProps = useAnimatedProps(() => {
    console.log(stepText.value);
    return {
      value: stepText.value,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.slider}>
        <Animated.View style={[styles.progress, progressStyle]} />
        <PanGestureHandler onGestureEvent={onGestureEvent}>
          <Animated.View style={[styles.knob, scrollTranslationStyle]}>
            <AnimatedTextInput
              underlineColorAndroid="transparent"
              editable={false}
              style={{fontSize: 24}}
              animatedProps={animatedProps}
              // value={stepText.value}
            />
          </Animated.View>
        </PanGestureHandler>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    margin: 50,
  },
  slider: {
    height: KNOB_WIDTH,
    width: SLIDER_WIDTH,
    borderRadius: KNOB_WIDTH / 2,
    backgroundColor: '#ddd',
    justifyContent: 'center',
  },
  progress: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#3f51b5',
    borderRadius: KNOB_WIDTH / 2,
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
