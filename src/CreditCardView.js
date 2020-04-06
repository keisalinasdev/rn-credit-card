import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { View, ImageBackground, Image, Text, Platform } from 'react-native';
import valid from 'card-validator';

import defaultIcons from './icons';
import FlipCard from 'react-native-flip-card';
import styles from './styles';

const BASE_SIZE = { width: 300, height: 190 };

const propTypes = {
  focused: PropTypes.string,

  brand: PropTypes.string,
  name: PropTypes.string,
  number: PropTypes.string,
  expiry: PropTypes.string,
  cvc: PropTypes.string,
  placeholder: PropTypes.object,

  scale: PropTypes.number,
  fontFamily: PropTypes.string,
  imageFront: PropTypes.number,
  imageBack: PropTypes.number,
  customIcons: PropTypes.object,
};

const defaultProps = {
  name: '',
  placeholder: {
    number: '•••• •••• •••• ••••',
    name: 'NAME',
    expiryTitle: 'MONTH/YEAR',
    expiry: '••/••',
    cvc: '•••',
  },

  scale: 1,
  fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
  imageFront: require('../assets/images/card-front.png'),
  imageBack: require('../assets/images/card-back.png'),
};

const CardView = (props) => {
  const {
    focused,
    name,
    number,
    expiryTitle,
    expiry,
    cvc,
    customIcons,
    placeholder,
    imageFront,
    imageBack,
    scale,
    fontFamily,
    style,
  } = props;

  const Icons = { ...defaultIcons, ...customIcons };
  const brand = useMemo(() => (number ? valid.number(number)?.card?.type : undefined), [number]);
  const isAmex = brand === 'american-express';
  const shouldFlip = () => !isAmex && focused === 'cvc';

  const containerSize = { ...BASE_SIZE, height: BASE_SIZE.height * scale };
  const transform = {
    transform: [{ scale }, { translateY: (BASE_SIZE.height * (scale - 1)) / 2 }],
  };

  const baseSyle = [styles.baseText, { fontFamily }];

  const isFocused = (type) => focused === type && styles.focused;

  return (
    <View style={[styles.cardContainer, containerSize, style]}>
      <FlipCard
        style={{ borderWidth: 0 }}
        flipHorizontal
        flipVertical={false}
        friction={10}
        perspective={2000}
        clickable={false}
        flip={shouldFlip()}>
        <ImageBackground style={[BASE_SIZE, styles.cardFace, transform]} source={imageFront}>
          <Image style={[styles.icon]} source={Icons[brand]} />
          <Text
            style={[
              ...baseSyle,
              styles.number,
              !number && styles.placeholder,
              isFocused('number'),
            ]}>
            {!number ? placeholder.number : number}
          </Text>
          <Text
            style={[...baseSyle, styles.name, !name && styles.placeholder, isFocused('name')]}
            numberOfLines={1}>
            {!name ? placeholder.name : name.toUpperCase()}
          </Text>
          <Text
            style={[
              styles.baseText,
              { fontFamily },
              styles.expiryLabel,
              !expiryTitle && styles.placeholder,
              focused === 'expiry' && styles.focused,
            ]}>
            {!expiryTitle ? placeholder.expiryTitle : expiryTitle.toUpperCase()}
          </Text>
          <Text
            style={[
              ...baseSyle,
              styles.expiry,
              !expiry && styles.placeholder,
              isFocused('expiry'),
            ]}>
            {!expiry ? placeholder.expiry : expiry}
          </Text>
          {isAmex && (
            <Text
              style={[...baseSyle, styles.amexCVC, !cvc && styles.placeholder, isFocused('cvc')]}>
              {!cvc ? placeholder.cvc : cvc}
            </Text>
          )}
        </ImageBackground>
        <ImageBackground style={[BASE_SIZE, styles.cardFace, transform]} source={imageBack}>
          <Text style={[styles.baseText, styles.cvc, !cvc && styles.placeholder, isFocused('cvc')]}>
            {!cvc ? placeholder.cvc : cvc}
          </Text>
        </ImageBackground>
      </FlipCard>
    </View>
  );
};

CardView.defaultProps = defaultProps;
CardView.propTypes = propTypes;

export default CardView;
