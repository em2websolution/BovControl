import AsyncStorage from "@react-native-async-storage/async-storage";
import CheckListUpdate from "../components/CheckListUpdate";
import NetInfo from "@react-native-community/netinfo";
import { Checklist, UpdateChecklist } from "../models/ChecklistModel";

const checkNetworkConnection = async () => {
  const netInfo = await NetInfo.fetch();
  return netInfo.isConnected;
};

const saveChecklistForLater = async (data: any, pending: any) => {
  try {
    const pendingData = await AsyncStorage.getItem(pending);

    if (pendingData) {
      const parsedData = JSON.parse(pendingData);
      const filteredData = parsedData.filter((item) => item._id !== data._id);
      filteredData.push(data);
      await AsyncStorage.setItem(pending, JSON.stringify(filteredData));
    } else {
      await AsyncStorage.setItem(pending, JSON.stringify([data]));
    }
  } catch (error) {
    console.error("Erro ao salvar dados para envio posterior:", error);
  }
};

const retrievePendingCreate = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const data = await AsyncStorage.multiGet(keys);

    let pendingCreates = [];

    for (let i = 0; i < data.length; i++) {
      const [status, items] = data[i];
      if (status === "pendingCreate") {
        const objects = JSON.parse(items);

        const finalData = objects.map((data) => {
          return { ...data, pending: true };
        });

        pendingCreates = pendingCreates.concat(finalData);
      }
    }
    return pendingCreates;
  } catch (error) {
    console.log("Error retrieving data: ", error);
  }
};

const retrievePendingUpdate = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const data = await AsyncStorage.multiGet(keys);

    let pendingUpdate = [];

    for (let i = 0; i < data.length; i++) {
      const [status, items] = data[i];
      if (status === "pendingUpdate") {
        const objects = JSON.parse(items);

        const finalData = objects.map((data) => {
          return { ...data, pending: true };
        });

        pendingUpdate = pendingUpdate.concat(finalData);
      }
    }
    return pendingUpdate;
  } catch (error) {
    console.log("Error retrieving data: ", error);
  }
};

const removeData = async (key) => {
  try {
    console.log("remove key", key);
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log("Error removing data: ", error);
  }
};

const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.log("Error clearing data: ", error);
  }
};

export default {
  checkNetworkConnection,
  saveChecklistForLater,
  retrievePendingCreate,
  retrievePendingUpdate,
  removeData,
  clearAll,
};
