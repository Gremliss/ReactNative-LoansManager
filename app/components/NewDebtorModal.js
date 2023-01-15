import { useState } from "react";
import {
  Dimensions,
  Keyboard,
  Modal,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import RoundIconBtn from "./RoundIconButton";

const NewDebtorModal = ({ visible, onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const handleModalClose = () => {
    Keyboard.dismiss();
  };

  const handleOnChangeTest = (text, valueFor) => {
    if (valueFor === "name") setName(text);
  };

  const handleSubmit = () => {
    onSubmit(name, Date.now());
    setName("");
    onClose();
  };

  const closeModal = () => {
    setName("");
    onClose();
  };

  const windowHeight = Dimensions.get("screen").height;

  return (
    <>
      <StatusBar />
      <Modal visible={visible} animationType="fade">
        <View style={styles.container}>
          <TextInput
            value={name}
            onChangeText={(text) => handleOnChangeTest(text, "name")}
            placeholder="Debtor name"
            style={[styles.input(windowHeight), styles.debtor]}
            multiline={true}
          />
          <TouchableWithoutFeedback onPress={handleModalClose}>
            <View style={[styles.modalBG, StyleSheet.absoluteFillObject]} />
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.btnContainer}>
          {name.trim() ? (
            <RoundIconBtn
              antIconName="check"
              onPress={handleSubmit}
              style={styles.addBtn}
            />
          ) : null}
          <RoundIconBtn
            style={styles.closeBtn}
            antIconName="close"
            onPress={closeModal}
          />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justiftyContent: "center",
    backgroundColor: "#41444B",
    alignContent: "center",
  },
  input: (windowHeight) => {
    return {
      borderBottomWidth: 2,
      borderBottomColor: "#557174",
      fontSize: 30,
      marginTop: windowHeight / 3,
      marginHorizontal: 20,
    };
  },
  debtor: {
    marginBottom: 15,
    fontWeight: "bold",
    justiftyContent: "center",
    alignItems: "center",
    width: "auto",
  },
  modalBG: {
    flex: 1,
    zIndex: -1,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  addBtn: {
    position: "absolute",
    left: 25,
    bottom: 20,
    zIndex: 1,
  },
  closeBtn: {
    position: "absolute",
    right: 25,
    bottom: 20,
    zIndex: 1,
    backgroundColor: "#9D9D9D",
  },
});

export default NewDebtorModal;
