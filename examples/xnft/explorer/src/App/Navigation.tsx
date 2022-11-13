import { Stack, Text, Image, View } from "react-xnft";
import React from "react";
// import TokenDetails from "./TokenDetails";
import AppList from "./AppList";
import AppDetails from "./AppDetails";

function Navigation() {
  return (
    <Stack.Navigator
      initialRoute={{ name: "list" }}
      options={({ route }) => {
        switch (route.name) {
          case "list":
            return {
              title: "xNFTs",
              props: {
                style: {
                  textAlign: "left",
                },
              },
            };
          case "details": {
            return {
              title: route.props?.app.json.name,
            };
          }
          default:
            throw new Error("unknown route");
        }
      }}
      style={{
        font: "Inter",
        fontSize: "20px",
        fontWeight: "700",
        height: "56px",
      }}
    >
      <Stack.Screen name={"list"} component={(props) => <AppList />} />
      <Stack.Screen
        name={"details"}
        component={(props) => <AppDetails {...props} />}
      />
    </Stack.Navigator>
  );
}

export default Navigation;
