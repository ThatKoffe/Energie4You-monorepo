import { useEffect, useState } from "react";
import {
    FlatList,
    RefreshControl,
    Text,
    View,
    TouchableOpacity,
} from "react-native";
import { TReport } from "../types/reports";
import { http } from "../config";
import ReportListItem from "../components/ReportListItem";
import { router } from "expo-router";

export default function Page() {
    const [list, setList] = useState<TReport[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    //? Get list of all reports
    const getList = async () => {
        setLoading(true);
        http.get(`/reports`)
            .then(({ data }) => {
                setList(data?.list || []);
            })
            .catch((err) => {
                alert(err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    //? on mount
    useEffect(() => {
        getList();
    }, []);

    //? Render UI
    return (
        <View
            style={{
                flex: 1,
            }}
        >
            <FlatList
                data={list}
                renderItem={({ item }) => (
                    <ReportListItem item={item} key={item?.id} />
                )}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={getList} />
                }
                ListHeaderComponent={() => (
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: "bold",
                            margin: 10,
                            marginVertical: 20,
                            textAlign: "center",
                        }}
                    >
                        {list?.length} Gemelde Defecten
                    </Text>
                )}
                ItemSeparatorComponent={() => (
                    <View
                        style={{
                            height: 20,
                            backgroundColor: "#fff",
                        }}
                    />
                )}
            />
            <TouchableOpacity
                style={{
                    backgroundColor: "#F54C4C",
                    padding: 20,
                    alignItems: "center",
                }}
                activeOpacity={0.8}
                onPress={() => {
                    router.push(`/reports/new`);
                }}
            >
                <Text
                    style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "#FFFFFF",
                    }}
                >
                    Meld Defect
                </Text>
            </TouchableOpacity>
        </View>
    );
}
