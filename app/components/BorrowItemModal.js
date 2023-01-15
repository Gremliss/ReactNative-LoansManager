import { useEffect, useState } from "react";
import {
  Dimensions,
  Keyboard,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import RoundIconBtn from "./RoundIconButton";

const BorrowItemModal = ({ visible, onClose, onSubmit }) => {
  const [forWhat, setForWhat] = useState("");
  const [amount, setAmount] = useState(0);
  const [borrowingMoney, setBorrowingMoney] = useState(true);
  const handleModalClose = () => {
    Keyboard.dismiss();
  };

  const handleOnChangeTest = (text, valueFor) => {
    if (valueFor === "forWhat") setForWhat(text);
    if (valueFor === "amount") setAmount(text);
  };

  const handleSubmit = () => {
    onSubmit(borrowingMoney, forWhat, amount, Date.now());
    setForWhat("");
    setAmount("");
    onClose();
  };

  const closeModal = () => {
    setForWhat("");
    setAmount();
    onClose();
  };

  const windowHeight = Dimensions.get("screen").height;

  return (
    <>
      <StatusBar />
      <Modal visible={visible} animationType="fade">
        <View style={styles.container}>
          <TextInput
            value={forWhat}
            onChangeText={(text) => handleOnChangeTest(text, "forWhat")}
            placeholder="Text"
            style={[styles.input(windowHeight), styles.debtor]}
            multiline={true}
          />
          {borrowingMoney ? (
            <TextInput
              value={amount}
              keyboardType="numeric"
              multiline
              placeholder="Amount"
              style={[styles.debtor]}
              onChangeText={(number) => handleOnChangeTest(number, "amount")}
            />
          ) : null}
          <View style={styles.btnContainer}>
            <TouchableOpacity
              onPress={() => setBorrowingMoney(true)}
              style={[styles.button, !borrowingMoney ? { opacity: 0.5 } : null]}
            >
              <Text style={[styles.buttonText]}>Money</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setBorrowingMoney(false)}
              style={[styles.button, borrowingMoney ? { opacity: 0.5 } : null]}
            >
              <Text style={[styles.buttonText]}>Other</Text>
            </TouchableOpacity>
          </View>

          <TouchableWithoutFeedback onPress={handleModalClose}>
            <View style={[styles.modalBG, StyleSheet.absoluteFillObject]} />
          </TouchableWithoutFeedback>
        </View>

        <View style={styles.btnContainer}>
          {forWhat.trim() ? (
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
    paddingHorizontal: 20,
    justiftyContent: "center",
    backgroundColor: "#41444B",
    flex: 1,
  },
  input: (windowHeight) => {
    return {
      // color: "",
      marginTop: windowHeight / 6,
      marginBottom: windowHeight / 20,
    };
  },
  debtor: {
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderBottomColor: "#557174",
    fontSize: 30,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  modalBG: {
    flex: 1,
    zIndex: -1,
  },
  btnContainer: {
    flexDirection: "row",
  },
  addBtn: {
    position: "absolute",
    left: 25,
    bottom: 20,
    zIndex: 1,
  },
  button: {
    zIndex: 1,
    paddingVertical: 15,
    backgroundColor: "#557174",
    borderRadius: 50,
    elevation: 5,
    flex: 1,
    margin: 15,
    marginTop: 50,
  },
  closeBtn: {
    position: "absolute",
    right: 25,
    bottom: 20,
    zIndex: 1,
    backgroundColor: "#9D9D9D",
  },
});

export default BorrowItemModal;
