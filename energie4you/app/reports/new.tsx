import { useEffect, useState } from "react";
import {
    ScrollView,
    Text,
    View,
    TouchableOpacity,
    Image,
    TextInput,
    ActivityIndicator,
} from "react-native";
import { EReportCategory } from "../../types/reports";
import { http } from "../../config";
import { router } from "expo-router";

import { Buffer as CBuffer } from "buffer";

//? Use location API
import * as Location from "expo-location";
//? Use Picker API
import * as ImagePicker from "expo-image-picker";
//? Picker
import { Picker } from "@react-native-picker/picker";

export default function Page() {
    //? States
    const [loading, setLoading] = useState<boolean>(false);
    const [location, setLocation] = useState<Location.LocationObject | null>(
        null
    );
    const [content, setContent] = useState<string>("");
    const [geoData, setGeoData] =
        useState<Location.LocationGeocodedAddress | null>();
    const [newImage, setNewImage] =
        useState<ImagePicker.ImagePickerAsset | null>(null);
    const [category, setCategory] = useState<EReportCategory>(
        EReportCategory.Grondkabels
    );

    //? On report button press
    const onReport = async () => {
        let _content = content?.trim();
        if (!_content) return alert("Geef een omschrijving op");
        if (!category) return alert("Selecteer een categorie");
        if (!newImage) return alert("Selecteer een foto");

        setLoading(true);

        let mediaUrl = "";

        try {
            //? get buffer
            let buffer = new CBuffer(newImage?.base64 as any, "base64");
            //? upload image to media url
            const { data: mediaData } = await http.post("/media", buffer, {
                headers: {
                    "Content-Type": `image/jpeg`,
                },
            });

            mediaUrl = mediaData?.mediaValue;
        } catch (err: any) {
            alert(err?.response?.data?.message || err?.message);
            setLoading(false);
            return;
        }

        try {
            //? Create report
            let {
                data: { report },
            } = await http.post("/reports", {
                content: _content,
                imageUrl: mediaUrl,
                category,
                gps: {
                    lat: location?.coords?.latitude,
                    lng: location?.coords?.longitude,
                    geo: geoData,
                },
            });

            //? route to page
            return router.replace(`/reports/${report?.id}`);
        } catch (err: any) {
            alert(err?.response?.data?.message || err?.message);
        } finally {
            setLoading(false);
        }
    };

    //? Pick image
    const pickImage = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
            base64: true,
        });

        if (!result.canceled) {
            setNewImage(result.assets[0]);
        }
    };

    //? Get location & perms
    useEffect(() => {
        (async () => {
            //? Get camera perms
            const { status: cameraStatus } =
                await ImagePicker.requestCameraPermissionsAsync();

            if (cameraStatus !== "granted") {
                alert(
                    "Niet genoeg rechten om camera te gebruiken, zet dit aan in de instellingen"
                );
                router.replace("/");
                return;
            }

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                alert(
                    "Niet genoeg rechten om locatie te gebruiken, zet dit aan in de instellingen"
                );
                router.replace("/");
                return;
            }

            //? Get location of user
            let location = await Location.getCurrentPositionAsync({});
            let reversed = await Location.reverseGeocodeAsync({
                latitude: location?.coords?.latitude,
                longitude: location?.coords?.longitude,
            });

            if (
                !reversed[0]?.street ||
                !reversed[0]?.city ||
                !reversed[0]?.region ||
                !reversed[0]?.country
            ) {
                alert("Kan locatie niet ophalen");
                router.replace("/");
                return;
            }

            //? Set location & geoData
            setLocation(location);
            setGeoData(reversed[0]);
        })();
    }, []);

    //? Render UI
    return (
        <View
            style={{
                flex: 1,
            }}
        >
            {loading && (
                <View
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 100,
                        backgroundColor: "rgba(0,0,0,0.4)",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <View
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "rgba(0,0,0,0.8)",
                            padding: 15,
                            borderRadius: 10,
                        }}
                    >
                        <ActivityIndicator size="large" color="#FFFFFF" />
                        <Text
                            style={{
                                color: "#FFFFFF",
                                fontSize: 16,
                                fontWeight: "bold",
                                marginTop: 10,
                            }}
                        >
                            Bezig met laden...
                        </Text>
                    </View>
                </View>
            )}
            <ScrollView
                style={{
                    flex: 1,
                }}
                contentContainerStyle={{
                    padding: 10,
                }}
            >
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={pickImage}
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Image
                        source={{
                            uri: newImage
                                ? newImage?.uri
                                : "https://cdn.pixabay.com/photo/2017/04/20/07/07/add-2244771_960_720.png",
                        }}
                        style={{
                            width: 200,
                            aspectRatio: 2 / 3,
                            overflow: "hidden",
                            backgroundColor: "#E6E6E6",
                            borderRadius: 10,
                        }}
                    />
                    <Text
                        style={{
                            textAlign: "center",
                            marginTop: 10,
                            color: "rgba(0,0,0,0.5)",
                        }}
                    >
                        Klik op de foto om een nieuwe te maken
                    </Text>
                </TouchableOpacity>
                <Text
                    style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        marginBottom: 10,
                        marginTop: 20,
                    }}
                >
                    Categorie
                </Text>

                <View
                    style={{
                        backgroundColor: "#E6E6E6",
                        borderRadius: 10,
                    }}
                >
                    <Picker
                        selectedValue={category}
                        onValueChange={(itemValue) => setCategory(itemValue)}
                        prompt="Selecteer een categorie"
                    >
                        {Object.values(EReportCategory).map((cat, i) => (
                            <Picker.Item
                                key={i}
                                label={cat}
                                value={cat}
                                color={cat ? undefined : "#666666"}
                            />
                        ))}
                    </Picker>
                </View>

                <Text
                    style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        marginBottom: 10,
                        marginTop: 20,
                    }}
                >
                    Omschrijving
                </Text>
                <TextInput
                    value={content}
                    onChangeText={(text) => setContent(text)}
                    placeholder="Omschrijving over de melding..."
                    multiline={true}
                    numberOfLines={5}
                    style={{
                        backgroundColor: "#E6E6E6",
                        padding: 10,
                        borderRadius: 10,
                        textAlignVertical: "top",
                    }}
                />
                <View
                    style={{
                        marginTop: 10,
                        marginBottom: 20,
                    }}
                >
                    {location ? (
                        <>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: "#666666",
                                }}
                            >
                                De volgende locatie wordt meegegeven bij de
                                melding: {geoData?.street}{" "}
                                {geoData?.streetNumber} {geoData?.city},{" "}
                                {geoData?.region}, {geoData?.country}
                            </Text>
                        </>
                    ) : (
                        <>
                            <Text
                                style={{
                                    textAlign: "center",
                                    color: "rgba(0,0,0,0.5)",
                                }}
                            >
                                Locatie aan het ophalen...
                            </Text>
                        </>
                    )}
                </View>
                <View
                    style={{
                        height: 20,
                    }}
                />
            </ScrollView>
            <TouchableOpacity
                style={{
                    backgroundColor: "#F54C4C",
                    padding: 20,
                    alignItems: "center",
                    opacity: loading ? 0.5 : 1,
                }}
                activeOpacity={0.8}
                onPress={onReport}
                disabled={loading}
            >
                <Text
                    style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "#FFFFFF",
                    }}
                >
                    {!loading ? "Meld Defect" : "Bezig..."}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
