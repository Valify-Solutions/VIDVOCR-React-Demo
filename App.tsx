import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { startOCR } from '@valifysolutions/react-native-vidvocr';

// Unified credentials
const creds = {
  baseURL: 'https://www.valifystage.com/', // Update with your actual base URL
  bundleKey: 'ad44eb94ca6747beaf99eef02407221f', // Replace with your actual bundle key
  userName: 'mobileusername', // Replace with actual credentials
  password: 'q5YT54wuJ2#mbanR',
  clientID: 'aKM21T4hXpgHFsgNJNTKFpaq4fFpoQvuBsNWuZoQ',
  clientSecret: 'r0tLrtxTue8c4kNmPVgaAFNGSeCWvL4oOZfBnVXoQe2Ffp5rscXXAAhX50BaZEll8ZRtr2BlgD3Nk6QLOPGtjbGXYoCBL9Fn7QCu5CsMlRKDbtwSnUAfKEG30cIv8tdW',
};
const language = "en"; // "en" is set as default
const document_verification = false; // false is set as default
const collect_user_info = false; // false is set as default
const document_verification_plus = false // false is set as default
const advanced_confidence = false; // false is set as default
const profession_analysis = false; // false is set as default
const review_data = false; // default is true
const preview_captured_image = true; //default is false
const manual_capture_mode = false; //default is false
const capture_only_mode = true; // default is false
const primaryColor = "";
const headers = {}; // default is empty
const enable_logging= false;
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
const getToken = async () => {
  const url = ${creds.baseURL}/api/o/token/;

  const body = username=${creds.userName}&password=${creds.password}&client_id=${creds.clientID}&client_secret=${creds.clientSecret}&grant_type=password;

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

  const handleStartValify = async () => {
    setLoading(true);

    const token = await getToken();

    if (token) {
      // Start OCR Process


      startOCR(ocrParams)
        .then((ocrResponse) => {
          console.log('OCR Result:', ocrResponse);

          // Parse the OCR response if it’s a string
          const parsedResponse = typeof ocrResponse === 'string' ? JSON.parse(ocrResponse) : ocrResponse;

          // Check the OCR result state
          if (parsedResponse.nameValuePairs?.state === "SUCCESS") {
            const transactionIdFront = parsedResponse.nameValuePairs?.ocrResult?.ocrResult?.transactionIdFront;
            console.log('Transaction ID Front:', transactionIdFront);

            if (transactionIdFront) {
              // Wait 2 seconds before starting liveness experience // 2 seconds delay
            } else {
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