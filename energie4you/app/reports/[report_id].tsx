import { useEffect, useState } from "react";
import {
    ScrollView,
    RefreshControl,
    Text,
    View,
    Image,
    TouchableOpacity,
} from "react-native";
import { TReport } from "../../types/reports";
import { http } from "../../config";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import * as Linking from "expo-linking";
import { momented } from "../../utils/moment";

//? Mail Composer
import * as MailComposer from "expo-mail-composer";
//? File System
import * as FileSystem from "expo-file-system";

export default function Page() {
    //? Get report id from url
    const { report_id } = useLocalSearchParams();
    const [report, setReport] = useState<TReport | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    //? Get item by id
    const getItem = async () => {
        setLoading(true);
        http.get(`/reports/${report_id}`)
            .then(({ data }) => {
                setReport(data?.report);
            })
            .catch((err) => {
                alert(err);
                router.replace("/");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const shareEmail = async () => {
        if (!report?.img)
            return alert("Geen afbeelding beschikbaar om te delen");
        try {
            let remoteFileName = report?.img?.split("/").pop();

            // if we can't parse the remote file name, we can't download it
            if (!remoteFileName)
                return alert(
                    "Kon de afbeelding naam niet parsen, probeer het later opnieuw"
                );

            // report?.img is on a remote server, so we need to download it first (pain)
            const { uri: fileUri } = await FileSystem.downloadAsync(
                report?.img!,
                FileSystem.documentDirectory + `/${remoteFileName}`
            );

            //? Compose email with all required data
            await MailComposer.composeAsync({
                subject: "Energie4You - Melding",
                body: `Beste,
                \n\nIn bijlage vindt u een foto van een melding van ${
                    report?.username
                }.
                \n\nDeze melding werd gedaan op ${momented(report?.date!)} in ${
                    report?.gps?.geo?.city
                } ${report?.gps?.geo?.street} ${
                    report?.gps?.geo?.streetNumber
                } (${report?.gps?.geo?.postalCode}).
                \n\nDeze melding valt onder de categorie "${report?.category}".
                \n\nDe beschrijving van de melding is als volgt: 
                \n${report?.description}
                \n
                \n\nDeze melding werd gedaan via de Energie4You app.
                \n\nMet vriend vriendelijke groeten,
                \nEnergie4You`,
                attachments: [fileUri],
            });
        } catch (err) {
            alert(err);
        }
    };

    //? on mount
    useEffect(() => {
        getItem();
    }, []);

    //? Render UI
    return (
        <View
            style={{
                flex: 1,
            }}
        >
            <ScrollView
                style={{
                    flex: 1,
                }}
                contentContainerStyle={{
                    padding: 10,
                }}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={getItem} />
                }
            >
                <TouchableOpacity
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    activeOpacity={0.8}
                    onPress={() => {
                        if (!report?.img)
                            return alert("Geen afbeelding beschikbaar");
                        Linking.openURL(report?.img!);
                    }}
                >
                    <Image
                        source={{
                            uri: report?.img,
                        }}
                        style={{
                            width: 200,
                            aspectRatio: 2 / 3,
                            overflow: "hidden",
                            backgroundColor: "#E6E6E6",
                            borderRadius: 10,
                        }}
                    />
                </TouchableOpacity>
                <View
                    style={{
                        marginTop: 15,
                    }}
                >
                    <Text>Gemeld door: {report?.username}</Text>
                    <Text
                        style={{
                            fontSize: 13,
                            color: "#666666",
                        }}
                    >
                        In {report?.gps?.geo?.city} {report?.gps?.geo?.street}{" "}
                        {report?.gps?.geo?.streetNumber} (
                        {report?.gps?.geo?.postalCode})
                    </Text>
                    <Text
                        style={{
                            fontSize: 13,
                            color: "#666666",
                        }}
                    >
                        Categorie: {report?.category}
                    </Text>
                    <Text
                        style={{
                            fontSize: 13,
                            color: "#666666",
                        }}
                    >
                        Datum: {momented(report?.date!)}
                    </Text>
                    <View
                        style={{
                            height: 3,
                            backgroundColor: "rgba(0,0,0,0.1)",
                            borderRadius: 10,
                            marginVertical: 10,
                        }}
                    />
                </View>
                <View>
                    <Text
                        style={{
                            fontSize: 15,
                            fontWeight: "bold",
                        }}
                    >
                        Beschrijving
                    </Text>
                    <Text
                        style={{
                            color: "#666666",
                        }}
                    >
                        {report?.description}
                    </Text>
                </View>
            </ScrollView>
            <TouchableOpacity
                style={{
                    backgroundColor: "#3BA55C",
                    padding: 20,
                    alignItems: "center",
                }}
                activeOpacity={0.8}
                onPress={shareEmail}
            >
                <Text
                    style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "#FFFFFF",
                    }}
                >
                    Deel via Email
                </Text>
            </TouchableOpacity>
        </View>
    );
}
