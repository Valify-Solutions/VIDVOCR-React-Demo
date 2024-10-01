import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Button,
  Alert,
  ActivityIndicator,
  Text,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox'; // Make sure to install this package

import { startOCR } from '@valifysolutions/react-native-vidvocr';

// Unified credentials
const creds = {
  baseURL: 'https://www.valifystage.com/',
  bundleKey: 'ad44eb94ca6747beaf99eef02407221f',
  userName: 'mobileusername',
  password: 'q5YT54wuJ2#mbanR',
  clientID: 'aKM21T4hXpgHFsgNJNTKFpaq4fFpoQvuBsNWuZoQ',
  clientSecret: 'r0tLrtxTue8c4kNmPVgaAFNGSeCWvL4oOZfBnVXoQe2Ffp5rscXXAAhX50BaZEll8ZRtr2BlgD3Nk6QLOPGtjbGXYoCBL9Fn7QCu5CsMlRKDbtwSnUAfKEG30cIv8tdW',
};

const App = (): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [isArabic, setIsArabic] = useState(false); // Language check
  const [documentVerification, setDocumentVerification] = useState(false);
  const [collectUserInfo, setCollectUserInfo] = useState(false);
  const [documentVerificationPlus, setDocumentVerificationPlus] = useState(false);
  const [advancedConfidence, setAdvancedConfidence] = useState(false);
  const [professionAnalysis, setProfessionAnalysis] = useState(false);
  const [reviewData, setReviewData] = useState(true); // Default is true
  const [previewCapturedImage, setPreviewCapturedImage] = useState(false);
  const [manualCaptureMode, setManualCaptureMode] = useState(false);
  const [captureOnlyMode, setCaptureOnlyMode] = useState(false);
  const [enableLogging, setEnableLogging] = useState(false);

  // Language setting
  const language = isArabic ? 'ar' : 'en';
  const primaryColor = '#0000FF'; // Default color is blue

  const ocrParams = {
    access_token: token, // token should be fetched before this
    base_url: creds.baseURL,
    bundle_key: creds.bundleKey,
    language: language,
    document_verification: documentVerification,
    collect_user_info: collectUserInfo,
    document_verification_plus: documentVerificationPlus,
    advanced_confidence: advancedConfidence,
    profession_analysis: professionAnalysis,
    review_data: reviewData,
    preview_captured_image: previewCapturedImage,
    manual_capture_mode: manualCaptureMode,
    capture_only_mode: captureOnlyMode,
    primaryColor: primaryColor,
    enable_logging: enableLogging,
    headers: {},
  };

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

  const handleStartValify = async () => {
    setLoading(true);

    const token = await getToken();

    if (token) {
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
      <View style={styles.optionsContainer}>
        <Text>Arabic Language</Text>
        <CheckBox value={isArabic} onValueChange={setIsArabic} />

        <Text>Document Verification</Text>
        <CheckBox value={documentVerification} onValueChange={setDocumentVerification} />

        <Text>Collect User Info</Text>
        <CheckBox value={collectUserInfo} onValueChange={setCollectUserInfo} />

        <Text>Document Verification Plus</Text>
        <CheckBox value={documentVerificationPlus} onValueChange={setDocumentVerificationPlus} />

        <Text>Advanced Confidence</Text>
        <CheckBox value={advancedConfidence} onValueChange={setAdvancedConfidence} />

        <Text>Profession Analysis</Text>
        <CheckBox value={professionAnalysis} onValueChange={setProfessionAnalysis} />

        <Text>Review Data</Text>
        <CheckBox value={reviewData} onValueChange={setReviewData} />

        <Text>Preview Captured Image</Text>
        <CheckBox value={previewCapturedImage} onValueChange={setPreviewCapturedImage} />

        <Text>Manual Capture Mode</Text>
        <CheckBox value={manualCaptureMode} onValueChange={setManualCaptureMode} />

        <Text>Capture Only Mode</Text>
        <CheckBox value={captureOnlyMode} onValueChange={setCaptureOnlyMode} />

        <Text>Enable Logging</Text>
        <CheckBox value={enableLogging} onValueChange={setEnableLogging} />
      </View>

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
  optionsContainer: {
    width: '80%',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '80%',
  },
});

export default App;
