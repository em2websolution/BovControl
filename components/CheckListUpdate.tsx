import { RouteProp, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { RadioButton, Switch } from "react-native-paper";
import moment from "moment";
import { Checklist, UpdateChecklist } from "../models/ChecklistModel";
import globalStyles, {
  StyledTextInput,
  globalDimension,
} from "../globalStyles";
import updateCheckListService from "../services/updateCheckListService";
import { Modal } from "react-native-paper";
import { globalApis } from "../api";
import repository from "../services/storageServices";

let pendingUpdate = "pendingUpdate";

interface Props {
  route: RouteProp<Record<string, object | undefined>, string>;
}

const CheckListUpdate: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [typeError, setTypeError] = useState(false);
  const [amount_of_milk_producedError, setAmountOfMilkProducedError] =
    useState(false);
  const [number_of_cows_headError, setNumberOfCowsHeadError] = useState(false);
  const [farmerNameError, setFarmerNameError] = useState(false);
  const [farmerCityError, setFarmerCityError] = useState(false);
  const [fromNameError, setFromNameError] = useState(false);
  const [toNameError, setToNameError] = useState(false);

  const options = [
    { label: "BPA", value: "BPA" },
    { label: "Antibiótico", value: "Antibiótico" },
    { label: "BPF", value: "BPF" },
  ];

  const [checklist, setChecklist] = useState(route.params.paramKey);

  const handleEndEditing = (value) => {
    const parsedValue = parseInt(value);
    if (!isNaN(parsedValue)) {
      return parsedValue;
    } else {
      return 0;
    }
  };

  function validateFields(): boolean {
    if (
      !checklist.type ||
      !checklist.amount_of_milk_produced ||
      !checklist.number_of_cows_head ||
      !checklist.farmer.name ||
      !checklist.farmer.city ||
      !checklist.from.name ||
      !checklist.to.name
    ) {
      if (checklist.from.name === "") {
        setFromNameError(true);
      }

      if (checklist.farmer.name === "") {
        setFarmerNameError(true);
      }

      if (checklist.farmer.city === "") {
        setFarmerCityError(true);
      }

      if (checklist.to.name === "") {
        setToNameError(true);
      }

      if (checklist.type === "") {
        setTypeError(true);
      }

      if (checklist.amount_of_milk_produced === "") {
        setAmountOfMilkProducedError(true);
      }

      if (checklist.number_of_cows_head === "") {
        setNumberOfCowsHeadError(true);
      }

      return true;
    } else {
      return false;
    }
  }

  const handleSave = async () => {
    if (validateFields()) return;

    const payload: UpdateChecklist = {
      type: checklist.type,
      amount_of_milk_produced: parseInt(checklist.amount_of_milk_produced),
      number_of_cows_head: parseInt(checklist.number_of_cows_head),
      had_supervision: checklist.had_supervision,
      farmer: {
        name: checklist.farmer.name,
        city: checklist.farmer.city,
      },
      from: {
        name: checklist.from.name,
      },
      to: {
        name: checklist.to.name,
      },
      location: {
        latitude: parseInt(checklist.location.latitude),
        longitude: parseInt(checklist.location.longitude),
      },
    };
    if (repository.checkNetworkConnection() && (payload?.pending === undefined || payload.pending == false) ) {
      const updatedChecklist = await updateCheckListService(
        payload,
        checklist._id
      );
      if (updatedChecklist) {
        setModalVisible(true);
        setTimeout(() => {
          navigation.navigate("Home");
        }, 1000);
      }
    } else {
      try {
        payload._id = checklist._id.toString();
        await repository.saveChecklistForLater(payload, pendingUpdate);
      } catch (error) {
        console.log(error);
      } finally {
        setModalVisible(true);
        setTimeout(() => {
          navigation.navigate("Home");
        }, 1000);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={globalStyles.label}>Fazenda de origem:</Text>
        <StyledTextInput
          value={checklist.from.name}
          onChangeText={(text) =>
            setChecklist({
              ...checklist,
              from: { ...checklist.from, name: text },
            })
          }
          style={
            fromNameError && !checklist.from.name && globalStyles.errorInput
          }
        />
      </View>

      <View style={styles.row}>
        <Text style={globalStyles.label}>Produtor:</Text>
        <StyledTextInput
          value={checklist.farmer.name}
          onChangeText={(text) =>
            setChecklist({
              ...checklist,
              farmer: { ...checklist.farmer, name: text },
            })
          }
          style={
            farmerNameError && !checklist.farmer.name && globalStyles.errorInput
          }
        />
      </View>

      <View style={styles.row}>
        <Text style={globalStyles.label}>Cidade do produtor:</Text>
        <StyledTextInput
          value={checklist.farmer.city}
          onChangeText={(text) =>
            setChecklist({
              ...checklist,
              farmer: { ...checklist.farmer, city: text },
            })
          }
          style={
            farmerCityError && !checklist.farmer.city && globalStyles.errorInput
          }
        />
      </View>

      <View style={styles.row}>
        <Text style={globalStyles.label}>Supervisor:</Text>
        <StyledTextInput
          value={checklist.to.name}
          onChangeText={(text) =>
            setChecklist({
              ...checklist,
              to: { ...checklist.to, name: text },
            })
          }
          style={toNameError && !checklist.to.name && globalStyles.errorInput}
        />
      </View>

      <View style={styles.row}>
        <Text style={globalStyles.label}>Tipo:</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {options.map((option) => (
            <>
              <RadioButton.Android
                key={option.value + new Date().toISOString()}
                value={option.value}
                status={
                  checklist?.type === option.value ? "checked" : "unchecked"
                }
                onPress={() =>
                  setChecklist({ ...checklist, type: option.value })
                }
              />
              <Text>{option.label}</Text>
            </>
          ))}
        </View>
      </View>
      {typeError && !checklist.type && (
        <Text style={globalStyles.error}>Selecione um tipo</Text>
      )}

      <View style={styles.row}>
        <Text style={globalStyles.label}>Quantidade de leite produzida:</Text>
        <StyledTextInput
          value={checklist.amount_of_milk_produced.toString()}
          onChangeText={(text) =>
            setChecklist({
              ...checklist,
              amount_of_milk_produced: handleEndEditing(text),
            })
          }
          style={
            amount_of_milk_producedError &&
            !checklist.amount_of_milk_produced &&
            globalStyles.errorInput
          }
          keyboardType="numeric"
        />
      </View>

      <View style={styles.row}>
        <Text style={globalStyles.label}>Número de cabeças de gado:</Text>
        <StyledTextInput
          value={checklist.number_of_cows_head.toString()}
          onChangeText={(text) =>
            setChecklist({
              ...checklist,
              number_of_cows_head: handleEndEditing(text),
            })
          }
          style={
            number_of_cows_headError &&
            !checklist.number_of_cows_head &&
            globalStyles.errorInput
          }
          keyboardType="numeric"
        />
      </View>

      <View style={styles.row}>
        <Text style={globalStyles.label}>Supervisionado:</Text>
        <Switch
          value={checklist.had_supervision}
          onValueChange={(value) =>
            setChecklist({
              ...checklist,
              had_supervision: value,
            })
          }
        />
      </View>

      <TouchableOpacity
        style={globalStyles.editButton}
        onPress={() => handleSave()}
      >
        <Text style={globalStyles.editButtonText}>Atualizar</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)}>
        <View style={globalStyles.modalContainer}>
          <Text style={globalStyles.title}>
            Checklist atualizado com sucesso!
          </Text>
        </View>
      </Modal>
    </View>
  );
};

export default CheckListUpdate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  row: {
    flexDirection: "row",
    marginBottom: 8,
  },
});
