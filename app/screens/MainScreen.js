import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import NewDebtorModal from "../components/NewDebtorModal";
import RoundIconBtn from "../components/RoundIconButton";
import { MaterialIcons } from "@expo/vector-icons";
import { CurrencyPicker } from "react-native-currency-picker/src/screens";

const MainScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [longPressActive, setLongPressActive] = useState(false);
  const [debtors, setDebtors] = useState([]);
  const [mainCurrency, setMainCurrency] = useState("zł");
  const [mainCurrencyCode, setMainCurrencyCode] = useState("PLN");

  const findDebtors = async () => {
    const result = await AsyncStorage.getItem("debtors");
    if (result !== null) setDebtors(JSON.parse(result));
  };
  const findCurrency = async () => {
    const result2 = await AsyncStorage.getItem("mainCurrency");
    if (result2 !== null) setMainCurrency(JSON.parse(result2));
    const result3 = await AsyncStorage.getItem("mainCurrencyCode");
    if (result3 !== null) setMainCurrencyCode(JSON.parse(result3));
  };

  useEffect(() => {
    findDebtors();
  });

  useEffect(() => {
    findCurrency();
  }, []);

  let totalSum = debtors.reduce((a, c) => {
    return a + c.owe;
  }, 0);

  const handleOnSubmit = async (name, timeCreated) => {
    const debtor = {
      name: name,
      owe: 0,
      isChecked: false,
      id: timeCreated,
      borrowedItems: [],
      borrowedMoney: [],
    };
    const updatedDebtors = [...debtors, debtor];
    setDebtors(updatedDebtors);
    await AsyncStorage.setItem("debtors", JSON.stringify(updatedDebtors));
  };

  const handleLongPress = async (item) => {
    if (!longPressActive) {
      debtors.forEach((item) => {
        item.isChecked = false;
      });
      handleCheckButton(item);
      setLongPressActive(true);
    }
  };

  const handleItemPressed = async (item) => {
    longPressActive ? handleCheckButton(item) : openDebtor(item, mainCurrency);
  };

  const handleCheckButton = async (item) => {
    item.isChecked == false
      ? (item.isChecked = true)
      : (item.isChecked = false);
    await AsyncStorage.setItem("debtors", JSON.stringify(debtors));
    findDebtors();
  };

  const openDebtor = async (debtor, mainCurrency) => {
    navigation.navigate("DebtorDetail", { debtor, mainCurrency });
  };

  const handleExitButton = async () => {
    debtors.forEach((item) => {
      item.isChecked = false;
    });
    setLongPressActive(false);
  };

  const displayDeleteAlert = () => {
    var count = 0;
    debtors.forEach((item) => {
      item.isChecked ? count++ : null;
    });
    Alert.alert(
      "Are you sure?",
      `This will delete ${count} checked debtors permanently`,
      [
        { text: "Delete", onPress: () => deleteDebtors() },
        { text: "Cancel", onPress: () => null },
      ],
      { cancelable: true }
    );
  };

  const deleteDebtors = async () => {
    const newDebtors = debtors.filter((n) => n.isChecked !== true);
    setDebtors(newDebtors);
    await AsyncStorage.setItem("debtors", JSON.stringify(newDebtors));
  };

  let currencyPickerRef = undefined;

  const handleCurrencyChange = async (symbolnative, code) => {
    setMainCurrency(symbolnative);
    setMainCurrencyCode(code);
    await AsyncStorage.setItem("mainCurrency", JSON.stringify(symbolnative));
    await AsyncStorage.setItem("mainCurrencyCode", JSON.stringify(code));
  };

  return (
    <>
      <StatusBar />
      <View style={styles.container}>
        <View style={styles.mainCurrencyContainer}>
          <Text>Main currency:</Text>
          <CurrencyPicker
            currencyPickerRef={(ref) => {
              currencyPickerRef = ref;
            }}
            enable={true}
            darkMode={false}
            currencyCode={mainCurrencyCode}
            showFlag={true}
            showCurrencyName={false}
            showCurrencyCode={true}
            onSelectCurrency={(data) => {
              handleCurrencyChange(data.symbol_native, data.code);
            }}
            onOpen={() => {}}
            onClose={() => {}}
            showNativeSymbol={true}
            showSymbol={false}
            containerStyle={{
              container: {},
              flagWidth: 25,
              currencyCodeStyle: {},
              currencyNameStyle: {},
              symbolStyle: {},
              symbolNativeStyle: {},
            }}
            modalStyle={{
              container: {},
              searchStyle: {},
              tileStyle: {},
              itemStyle: {
                itemContainer: {},
                flagWidth: 25,
                currencyCodeStyle: {},
                currencyNameStyle: {},
                symbolStyle: {},
                symbolNativeStyle: {},
              },
            }}
            title={"Currency"}
            searchPlaceholder={"Search"}
            showCloseButton={true}
            showModalTitle={true}
          />
        </View>
        <Text style={styles.lightHeader}>Total:</Text>
        <Text style={styles.boldHeader}>
          {totalSum} {mainCurrency}
        </Text>
      </View>
      <View style={styles.flatListContainer}>
        <FlatList
          data={debtors}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                onLongPress={() => handleLongPress(item)}
                onPress={() => handleItemPressed(item)}
                style={styles.debtorContainer}
              >
                {longPressActive ? (
                  <View style={styles.checkIcon}>
                    <MaterialIcons
                      name={
                        item.isChecked ? "check-box" : "check-box-outline-blank"
                      }
                      size={20}
                      color="white"
                    />
                  </View>
                ) : null}
                <Text style={styles.boldText}>
                  {index + 1}. {item.name}
                </Text>
                <Text style={[styles.boldText, { textAlign: "right" }]}>
                  {item.owe} {mainCurrency}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      <View style={styles.containerBottom}></View>
      {longPressActive ? (
        <RoundIconBtn
          onPress={displayDeleteAlert}
          antIconName={"delete"}
          style={styles.deleteBtn}
        />
      ) : null}
      {!longPressActive ? (
        <RoundIconBtn
          onPress={() => setModalVisible(true)}
          antIconName={"plus"}
          style={styles.addBtn}
        />
      ) : (
        <RoundIconBtn
          onPress={() => handleExitButton()}
          antIconName={"close"}
          style={styles.closeBtn}
        />
      )}

      <NewDebtorModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleOnSubmit}
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
  mainCurrencyContainer: {
    marginLeft: 20,
    marginBottom: 5,
    fontSize: 10,
    color: "#E7F6F2",
  },
  checkIcon: {
    justiftyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: 20,
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
  debtorContainer: {
    backgroundColor: "#557174",
    flexDirection: "row",
    borderRadius: 50,
    paddingHorizontal: 15,
    paddingVertical: 15,
    margin: 4,
    elevation: 2,
  },
  boldText: {
    fontSize: 20,
    color: "#E7F6F2",
    paddingLeft: 5,
    flex: 1,
  },
  addBtn: {
    position: "absolute",
    right: 25,
    bottom: 20,
    zIndex: 1,
    backgroundColor: "#9DAD7F",
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
  flatListContainer: {
    flex: 1,
    backgroundColor: "#2f3237",
  },
});

export default MainScreen;
