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
import { Checklist } from "../models/ChecklistModel";
import globalStyles, {
  StyledTextInput,
  globalDimension,
} from "../globalStyles";
import updateCheckListService from "../services/updateCheckListService";
import { Modal } from "react-native-paper";
import { globalApis } from "../api";
import createCheckListService from "../services/createCheckListService";
import repository from "../services/storageServices";

type Props = {
  onSubmit: (checklist: Checklist) => void;
};

const CheckListCreate: React.FC<Props> = ({ onSubmit }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState("");
  const [typeError, setTypeError] = useState(false);
  const [amount_of_milk_produced, setAmountOfMilkProduced] = useState("");
  const [amount_of_milk_producedError, setAmountOfMilkProducedError] =
    useState(false);
  const [number_of_cows_head, setNumberOfCowsHead] = useState("");
  const [number_of_cows_headError, setNumberOfCowsHeadError] = useState(false);
  const [farmerName, setFarmerName] = useState("");
  const [farmerNameError, setFarmerNameError] = useState(false);
  const [farmerCity, setFarmerCity] = useState("");
  const [farmerCityError, setFarmerCityError] = useState(false);
  const [fromName, setFromName] = useState("");
  const [fromNameError, setFromNameError] = useState(false);
  const [toName, setToName] = useState("");
  const [toNameError, setToNameError] = useState(false);
  const [had_supervision, setHadSupervision] = useState(false);

  let pendingCreate = "pendingCreate";

  const options = [
    { label: "BPA", value: "BPA" },
    { label: "Antibiótico", value: "Antibiótico" },
    { label: "BPF", value: "BPF" },
  ];

  const handleEndEditing = (value: string) => {
    const parsedValue = parseInt(value);
    if (!isNaN(parsedValue)) {
      return parsedValue;
    } else {
      return 0;
    }
  };

  function validateFields(): boolean {
    if (
      !type ||
      !amount_of_milk_produced ||
      !number_of_cows_head ||
      !farmerName ||
      !farmerCity ||
      !fromName ||
      !toName
    ) {
      if (fromName === "") {
        setFromNameError(true);
      }

      if (farmerName === "") {
        setFarmerNameError(true);
      }

      if (farmerCity === "") {
        setFarmerCityError(true);
      }

      if (toName === "") {
        setToNameError(true);
      }

      if (type === "") {
        setTypeError(true);
      }

      if (amount_of_milk_produced === "") {
        setAmountOfMilkProducedError(true);
      }

      if (number_of_cows_head === "") {
        setNumberOfCowsHeadError(true);
      }

      return true;
    } else {
      return false;
    }
  }

  const handleSave = async () => {
    if (validateFields()) return;

    const randomId = () => {
      return Math.floor(Math.random() * 100000009878214).toString();
    };

    const payLoad = {
      checklists: [
        {
          _id: randomId(),
          type,
          amount_of_milk_produced: parseInt(amount_of_milk_produced),
          number_of_cows_head: parseInt(number_of_cows_head),
          had_supervision,
          farmer: {
            name: farmerName,
            city: farmerCity,
          },
          from: {
            name: fromName,
          },
          to: {
            name: toName,
          },
          location: {
            latitude: 0,
            longitude: 0,
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    };

    if (repository.checkNetworkConnection()) {
      const createChecklist = await createCheckListService(payLoad);
      if (createChecklist) {
        setType("");
        setAmountOfMilkProduced("");
        setNumberOfCowsHead("");
        setHadSupervision(false);
        setFarmerName("");
        setFarmerCity("");
        setFromName("");
        setToName("");
        setModalVisible(true);
        setTimeout(() => {
          navigation.navigate("Home");
        }, 1000);
      }
    } else {
      try {
        await repository.saveChecklistForLater(
          payLoad.checklists[0],
          pendingCreate
        );
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
        <Text style={globalStyles.label}>*Fazenda de origem:</Text>
        <StyledTextInput
          placeholder="Nome da fazenda"
          value={fromName}
          onChangeText={setFromName}
          style={fromNameError && !fromName && globalStyles.errorInput}
        />
      </View>

      <View style={styles.row}>
        <Text style={globalStyles.label}>*Produtor:</Text>
        <StyledTextInput
          placeholder="Nome do produtor"
          value={farmerName}
          onChangeText={setFarmerName}
          style={farmerNameError && !farmerName && globalStyles.errorInput}
        />
      </View>

      <View style={styles.row}>
        <Text style={globalStyles.label}>*Cidade do produtor:</Text>
        <StyledTextInput
          placeholder="Cidade"
          value={farmerCity}
          onChangeText={setFarmerCity}
          style={farmerCityError && !farmerCity && globalStyles.errorInput}
        />
      </View>

      <View style={styles.row}>
        <Text style={globalStyles.label}>*Supervisor:</Text>
        <StyledTextInput
          placeholder="Nome do supervisor"
          value={toName}
          onChangeText={setToName}
          style={toNameError && !toName && globalStyles.errorInput}
        />
      </View>

      <View style={styles.row}>
        <Text style={globalStyles.label}>*Tipo:</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {options.map((option) => (
            <>
              <RadioButton.Android
                key={option.value + new Date().toISOString()}
                value={option.value}
                status={type === option.value ? "checked" : "unchecked"}
                onPress={() => setType(option.value)}
              />
              <Text>{option.label}</Text>
            </>
          ))}
        </View>
      </View>
      {typeError && !type && (
        <Text style={globalStyles.error}>Selecione um tipo</Text>
      )}

      <View style={styles.row}>
        <Text style={globalStyles.label}>*Quantidade de leite produzida:</Text>
        <StyledTextInput
          placeholder="0"
          value={amount_of_milk_produced}
          onChangeText={setAmountOfMilkProduced}
          style={
            amount_of_milk_producedError &&
            !amount_of_milk_produced &&
            globalStyles.errorInput
          }
          keyboardType="numeric"
        />
      </View>

      <View style={styles.row}>
        <Text style={globalStyles.label}>Número de cabeças de gado:</Text>
        <StyledTextInput
          placeholder="0"
          value={number_of_cows_head}
          onChangeText={setNumberOfCowsHead}
          style={
            number_of_cows_headError &&
            !number_of_cows_head &&
            globalStyles.errorInput
          }
          keyboardType="numeric"
        />
      </View>

      <View style={styles.row}>
        <Text style={globalStyles.label}>Supervisionado:</Text>
        <Switch
          value={had_supervision}
          onValueChange={(value) => setHadSupervision(value ? true : false)}
        />
      </View>

      <TouchableOpacity
        style={globalStyles.editButton}
        onPress={() => handleSave()}
      >
        <Text style={globalStyles.editButtonText}>Cadastrar</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)}>
        <View style={globalStyles.modalContainer}>
          <Text style={globalStyles.title}>Checklist salvo com sucesso!</Text>
        </View>
      </Modal>
    </View>
  );
};

export default CheckListCreate;

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
