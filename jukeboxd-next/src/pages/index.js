import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import LoginPage from "./login-page";
import { AuthProvider } from "@/backend/auth";

export default function Home() {
    return <LoginPage />;
}
