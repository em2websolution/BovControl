import { StyleSheet } from "react-native";
import { Dimensions, Platform } from "react-native";
import styled from "styled-components/native";

const window = Dimensions.get("window");

export const globalDimension = {
  width: window.width,
  height: window.height,
  sizeDevice: window.height > 667 ? "big" : "small",
};

export const globalColors = {
  blue: "#007AFF",
  red: "red",
  errorInput: "#ffcbd1"
};

export const StyledTextInput = styled.TextInput`
  font-size: 12px;
  font-weight: bold;
  color: #000000;
  background-color: #d3d3d3;
  width: 90%;
  padding: 0 2px 0 10px;
`;

export default StyleSheet.create({
  main: {
    paddingTop: 10,
    backgroundColor: "orange",
    alignItems: "center",
    height: 66,
  },
  logo: {
    width: 160,
    height: 50,
  },
  checkList: {
    width: globalDimension.width,
  },
  editButton: {
    top: 10,
    right: 10,
    backgroundColor: globalColors.blue,
    padding: 10,
    borderRadius: 5,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignSelf: "center",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  label: {
    fontWeight: "bold",
    marginTop: 4,
    marginRight: 8,
  },
  error: {
    color: globalColors.red,
  },
  errorInput: {
    backgroundColor: globalColors.errorInput,
  },
  card: {
    margin: 10,
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    elevation: 2,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
