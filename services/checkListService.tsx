import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import ChecklistList from "../components/CheckList";
import { Checklist, Props } from "../models/ChecklistModel";
import { globalApis } from "../api";
import { useNavigation } from "@react-navigation/native";
import repository from "../services/storageServices";
import updateCheckListService from "../services/updateCheckListService";
import createCheckListService, {
  createCheckListServicePending,
} from "./createCheckListService";

const CheckListService = () => {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const navigation = useNavigation();

  const fetchChecklists = async () => {
    if (repository.checkNetworkConnection()) {
      const pendingCreate = await repository.retrievePendingCreate();
      const pendingUpdate = await repository.retrievePendingUpdate();

      await sendPendingCreate(pendingCreate);
      await sendPendingUpdate(pendingUpdate);
    }

    try {
      const storageCreate = await repository.retrievePendingCreate();
      const storageUpdate = await repository.retrievePendingUpdate();

      const response = await fetch(globalApis.checkLists);
      const data = await response.json();

      setChecklists([...storageCreate, ...storageUpdate, ...data]);
    } catch (error) {
      console.error(error);
    }
  };

  const sendPendingUpdate = async (payload: any) => {
    try {
      const resultados = payload.map(async (item) => {
        let key = item._id;
        delete item._id;
        delete item.pending;
        const response = await updateCheckListService(item, key);
        await repository.removeData(key);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const sendPendingCreate = async (payload: any) => {
    try {
      await createCheckListServicePending(payload);

      const resultados = payload.map(async (item) => {
        await repository.removeData(item._id);
        console.log("response data create pending:", item._id);
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchChecklists();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View>
      <ChecklistList data={checklists} />
    </View>
  );
};

export default CheckListService;
