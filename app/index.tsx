import { useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function Index() {
  const { user, isUnapproved, isLoading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isUnapproved) {
        // User is logged in but not approved
        router.replace("/(auth)/pending-approval");
      } else if (!user) {
        // No user logged in
        router.replace("/(auth)/login");
      } else {
        // User is logged in and approved
        if (user.role === "admin") {
          router.replace("/(admin)/dashboard");
        } else if (user.role === "teacher") {
          router.replace("/(teacher)/dashboard");
        } else {
          router.replace("/(student)/dashboard");
        }
      }
    }
  }, [user, isUnapproved, isLoading]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}