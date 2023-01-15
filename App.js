import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import DebtorDetail from "./app/screens/DebtorDetail";
import MainScreen from "./app/screens/MainScreen";

const Stack = createStackNavigator();

export default function App() {
  const RenderMainScreen = (props) => <MainScreen {...props} />;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          component={RenderMainScreen}
          name="MainScreen"
          options={{
            title: "Loans Manager",
          }}
        />
        <Stack.Screen
          component={DebtorDetail}
          name="DebtorDetail"
          options={{ title: "Debtor Detail" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
