import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/backend/firebaseConfig"; // Assuming firebase config is in firebase.js

const ProtectedRoute = ({ children }) => {
    const [user, loading, error] = useAuthState(auth);
    const router = useRouter();
    const [isUserValid, setIsUserValid] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (user) {
                setIsUserValid(true);
            } else {
                router.push("/");
            }
        }
    }, [user, loading, router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return isUserValid ? <>{children}</> : null;
};

export default ProtectedRoute;
