import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Button,
  Alert,
  ActivityIndicator,
  AppState,
} from 'react-native';
import { startOCR } from '@valifysolutions/react-native-vidvocr';

// Unified credentials
const creds = {
  baseURL: '', // Update with your actual base URL
  bundleKey: '', // Replace with your actual bundle key
  userName: '', // Replace with actual credentials
  password: '',
  clientID: '',
  clientSecret: '',
};

const language = "en"; // "en" is set as default
const document_verification = false;
const collect_user_info = false;
const document_verification_plus = false;
const advanced_confidence = false;
const profession_analysis = false;
const review_data = false;
const preview_captured_image = true;
const manual_capture_mode = false;
const capture_only_mode = true;
const primaryColor = "";
const headers = {};
const enable_logging= false;

const getToken = async () => {
  const url = `${creds.baseURL}/api/o/token/`;

  const body = `username=${creds.userName}&password=${creds.password}&client_id=${creds.clientID}&client_secret=${creds.clientSecret}&grant_type=password`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body,
    });

    if (response.ok) {
      const jsonResponse = await response.json();
      return jsonResponse.access_token;
    } else {
      throw new Error('Failed to retrieve token');
    }
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Could not generate token');
    return null;
  }
};

const App = (): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground! Restarting SDK...');
        handleStartValify();  // Restart the SDK when the app comes back to foreground
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [appState]);

  const handleStartValify = async () => {
    setLoading(true);

    const token = await getToken();

    if (token) {
      const ocrParams = {
        access_token: token,
        base_url: creds.baseURL,
        bundle_key: creds.bundleKey,
        language: language,
        document_verification:document_verification,
        collect_user_info:collect_user_info,
        document_verification_plus:document_verification_plus,
        advanced_confidence:advanced_confidence,
        profession_analysis:profession_analysis,
        review_data:review_data,
        preview_captured_image:preview_captured_image,
        manual_capture_mode:manual_capture_mode,
        capture_only_mode:capture_only_mode,
        primaryColor:primaryColor,
        headers:headers,
        enable_logging:enable_logging
      };

      startOCR(ocrParams)
        .then((ocrResponse) => {
          console.log('OCR Result:', ocrResponse);

          const parsedResponse = typeof ocrResponse === 'string' ? JSON.parse(ocrResponse) : ocrResponse;

          if (parsedResponse.nameValuePairs?.state === "SUCCESS") {
            const transactionIdFront = parsedResponse.nameValuePairs?.ocrResult?.ocrResult?.transactionIdFront;
            console.log('Transaction ID Front:', transactionIdFront);

            if (!transactionIdFront) {
              Alert.alert('Error', 'Transaction ID not found in OCR response');
            }
          } else {
            console.log('Current OCR state is not SUCCESS');
          }
        })
        .catch((ocrError) => {
          console.error('OCR Error:', ocrError);
          Alert.alert('Error', 'OCR failed');
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button title="Start Valify" onPress={handleStartValify} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '80%',
  },
});

export default App;
