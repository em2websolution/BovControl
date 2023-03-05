import { RouteProp, useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import moment from "moment";
import { Checklist, Props } from "../models/ChecklistModel";

interface Props {
  route: RouteProp<Record<string, object | undefined>, string>;
}

const ChecklistDetails: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation();
  const [selectedChecklist, setSelectedChecklist] = useState<Checklist | null>(
    null
  );
  const handleChecklistPress = useCallback((checklist: Checklist) => {
    setSelectedChecklist(checklist);
    navigation.navigate("Atualizar checklist", { paramKey: checklist });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Data de criação:</Text>
        <Text>{route.params.paramKey.created_at}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Data de atualização:</Text>
        <Text>{route.params.paramKey.updated_at}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Tipo:</Text>
        <Text>{route.params.paramKey.type}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Quantidade de leite produzida:</Text>
        <Text>{route.params.paramKey.amount_of_milk_produced}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Produtor:</Text>
        <Text>{route.params.paramKey.farmer.name}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Cidade do produtor:</Text>
        <Text>{route.params.paramKey.farmer.city}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Fazenda de origem:</Text>
        <Text>{route.params.paramKey.from.name}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Supervisor:</Text>
        <Text>{route.params.paramKey.to.name}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Número de cabeças de gado:</Text>
        <Text>{route.params.paramKey.number_of_cows_head}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Supervisionado:</Text>
        <Text>{route.params.paramKey.had_supervision ? "Sim" : "Não"}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Latitude:</Text>
        <Text>{route.params.paramKey.location.latitude}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Longitude:</Text>
        <Text>{route.params.paramKey.location.longitude}</Text>
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => handleChecklistPress(route.params.paramKey)}
      >
        <Text style={styles.editButtonText}>Editar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChecklistDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
    marginRight: 8,
  },
  editButton: {
    top: 10,
    right: 10,
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
