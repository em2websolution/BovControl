import React, { useCallback, useEffect, useState } from "react";
import { FlatList } from "react-native";
import { List, Divider } from "react-native-paper";
import globalStyles from "../globalStyles";
import moment from "moment";
import { Checklist, Props } from "../models/ChecklistModel";
import { useNavigation } from "@react-navigation/native";
//import repository from "../services/storageServices";

const ChecklistList: React.FC<Props> = ({ data }) => {
  const navigation = useNavigation();

  const handleChecklistPress = useCallback((checklist: Checklist) => {
    navigation.navigate("Dados da produção", { paramKey: checklist });
  }, []);

  const renderItem = ({ item }: { item: Checklist }) => (
    <>
      <List.Section>
        <List.Item
          key={item._id + new Date().toISOString()}
          style={
            item.pending === true
              ? globalStyles.errorInput
              : globalStyles.checkList
          }
          title={`${item.from.name}`}
          description={`${item.farmer.name} - ${item.farmer.city} \n ${moment(
            item.created_at
          ).format("DD/MM/YYY HH:mm:ss")}`}
          left={() => {
            if (item.pending) {
              return <List.Icon icon="access-point-network-off" />;
            } else {
              return <List.Icon icon="check" />;
            }
          }}
          onPress={() => handleChecklistPress(item)}
        />
      </List.Section>
      <Divider />
    </>
  );

  return (
    <>
      <List.Section>
        <FlatList
          data={data}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <Divider />}
        />
      </List.Section>
    </>
  );
};

export default ChecklistList;
