import React, { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";
import styles from "./styles";
import styled from "styled-components/native";
import CheckListService from "../../services/checkListService";
import { FAB } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const StyledView = styled.View`
  background-color: #ffffff;
  align-items: center;
  justify-content: center;
`;

const StyledText = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #000000;
  padding: 10px;
`;

export default function HomeScreen(): any {
  const navigation = useNavigation();

  const handleCreatePress = useCallback(() => {
    navigation.navigate("Cadastrar checklist");
  }, []);

  return (
    <View style={styles.container}>
      <StyledView>
        <StyledText>Checklists</StyledText>
      </StyledView>
      <CheckListService></CheckListService>
      <View>
        <FAB
          icon="plus"
          onPress={() => {
            handleCreatePress();
          }}
          style={styles.fab}
        />
      </View>
    </View>
  );
}
