import React from 'react';
import { View, Text, Button } from 'react-native';
import { LandingPageButton } from '../../components/LandingPageButton';
import { LandingPageWelcome } from '../../components/LandingPageWelcome';

export const HomeScreen = ({ navigation }) => {
  return (
    <View>
      <LandingPageWelcome text="SmartCart."/>
      <LandingPageButton text="Sign In" />
      <LandingPageButton text="Create Accont" />
    </View>
  );
};
