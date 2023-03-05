import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import ChecklistList from "../components/CheckList";
import { Checklist, Props } from "../models/ChecklistModel";
import { globalApis } from "../api";

export const createCheckListServicePending = async (checklist: any) => {
  try {
    const payload = {
      checklists: [],
    };
    checklist.forEach((value) => {
      var farmerName = value.farmer["name"];
      var farmerCity = value.farmer["city"];
      var fromName = value.from["name"];
      var toName = value.to["name"];

      let checklistNew: Checklist = {
        _id: value._id,
        type: value.type,
        amount_of_milk_produced: parseInt(value.amount_of_milk_produced),
        number_of_cows_head: parseInt(value.number_of_cows_head),
        had_supervision: value.had_supervision,
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
      };

      var parseObject = JSON.stringify(checklistNew).replace(/\\/g, "");

      payload.checklists.push(parseObject);
    });

    var payloadFinal = JSON.stringify(payload)
      .replace(/\\/g, "")
      .replace('["', "[")
      .replace('"]', "]");

    const response = await fetch(`${globalApis.checkLists}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: payloadFinal,
    });
    const createdChecklist = await response.json();
    return createdChecklist;
  } catch (error) {
    console.error(error);
  }
};

const createCheckListService = async (checklist: Props) => {
  try {
    const response = await fetch(`${globalApis.checkLists}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(checklist),
    });
    const createdChecklist = await response.json();
    return createdChecklist;
  } catch (error) {
    console.error(error);
  }
};

export default createCheckListService;
