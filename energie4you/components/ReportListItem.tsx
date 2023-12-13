import React from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import { TReport } from "../types/reports";
import { momented } from "../utils/moment";
import { router } from "expo-router";

export default function ReportListItem({ item }: { item: TReport }) {
    //? Re-usable report list item component
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
                router.push(`/reports/${item?.id}`);
            }}
            style={{
                backgroundColor: "#D9D9D9",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                height: 100,
            }}
        >
            <View
                style={{
                    flex: 1,
                    padding: 10,
                }}
            >
                <Text
                    style={{
                        fontSize: 15,
                    }}
                    numberOfLines={1}
                >
                    {item?.username}
                </Text>
                <Text
                    style={{
                        fontSize: 13,
                        color: "#666666",
                    }}
                    numberOfLines={3}
                >
                    {item?.description}
                </Text>
                <Text
                    style={{
                        fontSize: 12,
                        color: "#666666",
                        marginTop: 5,
                    }}
                    numberOfLines={1}
                >
                    {momented(item?.date)} - {item?.category}
                </Text>
            </View>
            <View
                style={{
                    width: 100,
                    height: 100,
                    backgroundColor: "#E6E6E6",
                }}
            >
                <Image
                    source={{
                        uri: item?.img,
                    }}
                    style={{
                        width: 100,
                        height: 100,
                    }}
                />
            </View>
        </TouchableOpacity>
    );
}
