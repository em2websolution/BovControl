import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import ChecklistList from "../components/CheckList";
import { UpdateChecklist, Props } from "../models/ChecklistModel";
import { globalApis } from "../api";

const updateCheckListService = async (
  checklist: UpdateChecklist,
  id: string
) => {
  try {
    const response = await fetch(`${globalApis.checkLists}/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(checklist),
    });
    const updatedChecklist = await response.json();
    return updatedChecklist;
  } catch (error) {
    console.error(error);
  }
};

export default updateCheckListService;
