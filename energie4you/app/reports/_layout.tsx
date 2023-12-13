import { Slot } from "expo-router";
import BackNav from "../../components/BackNav";

export default function Layout() {
    //? Apply the backnav to all /reports pages
    return (
        <>
            <BackNav />
            <Slot />
        </>
    );
}
