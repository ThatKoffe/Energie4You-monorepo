import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function BackNav() {
    //? Re-usable back navigation component
    return (
        <View
            style={{
                backgroundColor: "#D9D9D9",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                height: 60,
            }}
        >
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                    if (router.canGoBack()) router.back();
                    else router.replace("/");
                }}
                style={{
                    width: 60,
                    height: 60,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Text
                    style={{
                        fontSize: 16,
                        fontWeight: "bold",
                    }}
                >
                    Terug
                </Text>
            </TouchableOpacity>
        </View>
    );
}
