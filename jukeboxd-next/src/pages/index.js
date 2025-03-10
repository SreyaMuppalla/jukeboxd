import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LoginPage from './login-page';  // Import your LoginPage component

export default function Home() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false); // Track if we're on the client-side
  const [isRedirecting, setIsRedirecting] = useState(false); // Track if we're redirecting

  // UseEffect to detect client-side rendering
  useEffect(() => {
    setIsClient(true); // Set to true once the component is mounted on the client
  }, []);

  useEffect(() => {
    // Only run this logic on the client-side
    if (isClient) {
      if (window.location.pathname === "/") {
        setIsRedirecting(false); // Don't redirect if we're on the root
      } else {
        setIsRedirecting(true); // Set redirect flag to true for other paths
        router.push(window.location.pathname); // Redirect to current path
      }
    }
  }, [isClient, router]);

  // Render LoginPage if we're on the root
  if (isClient && window.location.pathname === "/" && !isRedirecting) {
    return <LoginPage />; // Render the LoginPage component
  }

  // Default loading screen while routing
  return (
    <div style={{ backgroundColor: 'black', color: 'white', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 0 }}>
      <div style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center' }}>
        Loading Page...
      </div>
    </div>
  );
}
