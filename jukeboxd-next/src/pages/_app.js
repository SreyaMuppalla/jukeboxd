import { AuthProvider } from "@/backend/auth";
import Header from "@/bigcomponents/Header";
import "@/styles/globals.css";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
    const router = useRouter();
    return (
        <>
            <AuthProvider>
                {/* display header on all pages except login */}
                {router.pathname !== "/" && <Header />}
                <Component {...pageProps} />
            </AuthProvider>
        </>
    );
}
