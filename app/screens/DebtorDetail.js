import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import BorrowItemModal from "../components/BorrowItemModal";
import RoundIconBtn from "../components/RoundIconButton";

const DebtorDetail = (props) => {
  const mainCurrency = props.route.params.mainCurrency;
  const [debtor, setDebtor] = useState(props.route.params.debtor);
  const [name, setName] = useState(debtor.name);
  const [owe, setOwe] = useState(debtor.owe);
  const [debtors, setDebtors] = useState([]);

  const [longPressActive, setLongPressActive] = useState(false);
  const [checkAllItems, setCheckAllItems] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  let sum = debtor.borrowedMoney.reduce((a, c) => {
    return a + c.howMuch;
  }, 0);

  debtor.owe = sum;

  const handleOnChangeTest = (text, valueFor) => {
    if (valueFor === "name") setName(text);
    if (valueFor === "owe") setOwe(text);
  };

  const handleSubmit = () => {
    handleUpdate(name, owe);
    props.navigation.goBack();
  };

  const handleUpdate = async (name, owe) => {
    const result = await AsyncStorage.getItem("debtors");
    let debtors = [];
    if (result !== null) debtors = JSON.parse(result);

    const newDebtors = debtors.filter((n) => {
      if (n.id === debtor.id) {
        n.name = name;
        n.owe = owe;

        setDebtor(n);
      }
      return n;
    });
    setDebtors(newDebtors);
    await AsyncStorage.setItem("debtors", JSON.stringify(newDebtors));
  };

  const handleOnSubmitModal = async (
    borrowingMoney,
    forWhat,
    howMuch,
    timeCreated
  ) => {
    const result = await AsyncStorage.getItem("debtors");
    let debtors = [];
    if (result !== null) debtors = JSON.parse(result);

    if (borrowingMoney) {
      const replaceComma = howMuch.replace(",", ".");
      const oweNumber = Number(replaceComma);
      if (isNaN(oweNumber)) {
        ToastAndroid.show("Invalid number", 3000);
      } else {
        const borrowed = {
          forWhat: forWhat,
          howMuch: oweNumber,
          isChecked: false,
          id: timeCreated,
        };
        debtor.borrowedMoney = [...debtor.borrowedMoney, borrowed];
      }
    } else {
      const borrowed = {
        forWhat: forWhat,
        isChecked: false,
        id: timeCreated,
      };
      debtor.borrowedItems = [...debtor.borrowedItems, borrowed];
    }
    const newDebtors = debtors.filter((n) => {
      if (n.id === debtor.id) {
        n.borrowedItems = debtor.borrowedItems;
        n.borrowedMoney = debtor.borrowedMoney;

        setDebtor(n);
      }
      return n;
    });
    setDebtors(newDebtors);

    await AsyncStorage.setItem("debtors", JSON.stringify(debtors));
  };

  const handleLongPress = async (item) => {
    if (!longPressActive) {
      debtor.borrowedItems.forEach((i) => {
        i.isChecked = false;
      });
      debtor.borrowedMoney.forEach((i) => {
        i.isChecked = false;
      });
      handleCheckButton(item);
      setCheckAllItems(false);
      setLongPressActive(true);
    }
  };

  const handleCheckButton = async (item) => {
    item.isChecked == false
      ? (item.isChecked = true)
      : (item.isChecked = false);

    const result = await AsyncStorage.getItem("debtors");
    let debtors = [];
    if (result !== null) debtors = JSON.parse(result);

    const newDebtors = debtors.filter((n) => {
      if (n.id === debtor.id) {
        n.borrowedItems = debtor.borrowedItems;
        n.borrowedMoney = debtor.borrowedMoney;

        setDebtor(n);
      }
      return n;
    });
  };

  const displayDeleteAlert = () => {
    var count = 0;
    debtor.borrowedItems.forEach((item) => {
      item.isChecked ? count++ : null;
    });
    debtor.borrowedMoney.forEach((item) => {
      item.isChecked ? count++ : null;
    });
    Alert.alert(
      "Are you sure?",
      `This will delete ${count} checked items permanently`,
      [
        { text: "Delete", onPress: () => deleteDebtors() },
        { text: "Cancel", onPress: () => null },
      ],
      { cancelable: true }
    );
  };

  const deleteDebtors = async () => {
    debtor.borrowedItems = debtor.borrowedItems.filter(
      (n) => n.isChecked !== true
    );
    debtor.borrowedMoney = debtor.borrowedMoney.filter(
      (n) => n.isChecked !== true
    );

    const result = await AsyncStorage.getItem("debtors");
    let debtors = [];
    if (result !== null) debtors = JSON.parse(result);

    const newDebtors = debtors.filter((n) => {
      if (n.id === debtor.id) {
        n.borrowedItems = debtor.borrowedItems;
        n.borrowedMoney = debtor.borrowedMoney;

        setDebtor(n);
      }
      return n;
    });

    setDebtors(newDebtors);
    await AsyncStorage.setItem("debtors", JSON.stringify(newDebtors));
  };

  const handleExitButton = async () => {
    debtor.borrowedItems.forEach((item) => {
      item.isChecked = false;
    });
    debtor.borrowedMoney.forEach((item) => {
      item.isChecked = false;
    });
    setLongPressActive(false);
  };

  const handleItemPressed = async (item) => {
    longPressActive ? handleCheckButton(item) : null;
  };

  const handleCheckAllItems = async () => {
    if (checkAllItems) {
      debtor.borrowedItems.forEach((item) => {
        item.isChecked = false;
      });
      debtor.borrowedMoney.forEach((item) => {
        item.isChecked = false;
      });
      setCheckAllItems(false);
    } else {
      debtor.borrowedItems.forEach((item) => {
        item.isChecked = true;
      });
      debtor.borrowedMoney.forEach((item) => {
        item.isChecked = true;
      });
      setCheckAllItems(true);
    }
  };

  const formatDate = (ms) => {
    const date = new Date(ms);
    const day = checkFormat(date.getDate());
    const month = checkFormat(date.getMonth() + 1);
    const year = checkFormat(date.getFullYear());
    const hrs = checkFormat(date.getHours());
    const min = checkFormat(date.getMinutes());
    const sec = checkFormat(date.getSeconds());
    return `${day}/${month}/${year} - ${hrs}:${min}:${sec}`;
  };

  const checkFormat = (value) => {
    if (value > 9) {
      var newValue = value;
    } else {
      var newValue = "0" + value;
    }
    return newValue;
  };

  return (
    <>
      <View style={styles.container}>
        <TextInput
          value={name}
          onChangeText={(text) => handleOnChangeTest(text, "name")}
          placeholder="Name"
          style={styles.lightHeader}
        />
        <Text style={styles.boldHeader}>
          {sum} {mainCurrency}
        </Text>
      </View>

      <View style={styles.flatListContainer}>
        <FlatList
          data={debtor.borrowedMoney}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                onLongPress={() => handleLongPress(item)}
                onPress={() => handleItemPressed(item)}
                style={styles.debtorContainer}
              >
                <View style={styles.firstLine}>
                  {longPressActive ? (
                    <View style={styles.checkIcon}>
                      <MaterialIcons
                        name={
                          item.isChecked
                            ? "check-box"
                            : "check-box-outline-blank"
                        }
                        size={20}
                        color="white"
                      />
                    </View>
                  ) : null}
                  <Text style={styles.boldText}>
                    {index + 1}. {item.forWhat}
                  </Text>
                  <Text style={[styles.boldText, { textAlign: "right" }]}>
                    {item.howMuch} {mainCurrency}
                  </Text>
                </View>
                <Text style={styles.dateCreated}>{formatDate(item.id)}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      <View style={styles.flatListContainer}>
        <Text style={styles.lightHeader}>Other items</Text>
        <FlatList
          data={debtor.borrowedItems}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                onLongPress={() => handleLongPress(item)}
                onPress={() => handleItemPressed(item)}
                style={styles.debtorContainer}
              >
                <View style={styles.firstLine}>
                  {longPressActive ? (
                    <View style={styles.checkIcon}>
                      <MaterialIcons
                        name={
                          item.isChecked
                            ? "check-box"
                            : "check-box-outline-blank"
                        }
                        size={20}
                        color="white"
                      />
                    </View>
                  ) : null}
                  <Text style={styles.boldText}>
                    {index + 1}. {item.forWhat}
                  </Text>
                  <Text style={[styles.boldText, { textAlign: "right" }]}>
                    {item.howMuch}
                  </Text>
                </View>
                <Text style={styles.dateCreated}>{formatDate(item.id)}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      <View style={styles.containerBottom}></View>

      {!longPressActive ? (
        <RoundIconBtn
          antIconName="check"
          onPress={handleSubmit}
          style={styles.styleBtn}
        />
      ) : (
        <RoundIconBtn
          onPress={displayDeleteAlert}
          antIconName={"delete"}
          style={styles.deleteBtn}
        />
      )}
      {!longPressActive ? (
        <RoundIconBtn
          onPress={() => setModalVisible(true)}
          antIconName={"plus"}
          style={styles.styleBtn}
        />
      ) : (
        <RoundIconBtn
          onPress={() => handleExitButton()}
          antIconName={"close"}
          style={styles.closeBtn}
        />
      )}

      {longPressActive ? (
        <TouchableOpacity
          onPress={() => handleCheckAllItems()}
          style={styles.checkAllIcon}
        >
          <MaterialIcons
            name={checkAllItems ? "check-box" : "check-box-outline-blank"}
            size={20}
            color="white"
          />
        </TouchableOpacity>
      ) : null}

      <BorrowItemModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleOnSubmitModal}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
    paddingTop: 20,
    backgroundColor: "#2f3237",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 30,
    zIndex: 1,
  },
  containerBottom: {
    paddingBottom: 40,
    paddingTop: 40,
    backgroundColor: "#2f3237",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 30,
    zIndex: 1,
  },
  checkIcon: {
    justiftyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: 20,
  },
  checkAllIcon: {
    position: "absolute",
    left: 20,
    top: 80,
    zIndex: 1,
  },
  styleBtn: {
    position: "absolute",
    right: 25,
    bottom: 20,
    zIndex: 1,
  },
  deleteBtn: {
    position: "absolute",
    left: 25,
    bottom: 20,
    zIndex: 1,
    backgroundColor: "#BB6464",
  },
  closeBtn: {
    position: "absolute",
    right: 25,
    bottom: 20,
    zIndex: 1,
    backgroundColor: "#9D9D9D",
  },
  lightHeader: {
    fontSize: 25,
    textAlign: "center",
    color: "#E7F6F2",
  },
  boldHeader: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: "#E7F6F2",
  },
  boldText: {
    fontSize: 20,
    color: "#E7F6F2",
    paddingLeft: 5,
    flex: 1,
  },
  dateCreated: {
    flex: 1,
    opacity: 0.5,
    fontSize: 12,
    textAlign: "right",
    paddingHorizontal: 5,
  },
  debtorContainer: {
    backgroundColor: "#557174",
    borderRadius: 50,
    padding: 10,
    margin: 4,
    elevation: 2,
  },
  firstLine: {
    flexDirection: "row",
    paddingHorizontal: 5,
  },
  flatListContainer: {
    flex: 1,
    backgroundColor: "#2f3237",
  },
});

export default DebtorDetail;
