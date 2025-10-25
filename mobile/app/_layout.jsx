import { SafeAreaView } from "react-native-safe-area-context";
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { ClerkProvider } from "@clerk/clerk-expo";
import { Slot } from "expo-router";

// import { COLORS } from "@constants/colors.js";

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <SafeAreaView>
        <Slot />
      </SafeAreaView>
    </ClerkProvider>
  );
}
