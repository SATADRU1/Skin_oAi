/**
 * Camera utility functions for debugging and testing
 */
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export const checkCameraPermissions = async () => {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    console.log('Camera permission status:', status);
    return status === 'granted';
  } catch (error) {
    console.error('Error checking camera permissions:', error);
    return false;
  }
};

export const checkMediaLibraryPermissions = async () => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log('Media library permission status:', status);
    return status === 'granted';
  } catch (error) {
    console.error('Error checking media library permissions:', error);
    return false;
  }
};

export const validateImageData = (imageData: any) => {
  if (!imageData) {
    console.error('No image data provided');
    return false;
  }
  
  if (!imageData.base64) {
    console.error('No base64 data in image');
    return false;
  }
  
  if (imageData.base64.length < 100) {
    console.error('Base64 data seems too short:', imageData.base64.length);
    return false;
  }
  
  console.log('Image data validation passed:', {
    hasBase64: !!imageData.base64,
    base64Length: imageData.base64.length,
    uri: imageData.uri
  });
  
  return true;
};

export const testImagePicker = async () => {
  try {
    console.log('Testing image picker...');
    
    const hasPermission = await checkMediaLibraryPermissions();
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Media library permission is required for testing');
      return null;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
      allowsMultipleSelection: false,
    });
    
    if (result.canceled) {
      console.log('Image picker was cancelled');
      return null;
    }
    
    if (!result.assets || result.assets.length === 0) {
      console.error('No assets returned from image picker');
      return null;
    }
    
    const asset = result.assets[0];
    console.log('Image picker test result:', {
      hasAsset: !!asset,
      hasBase64: !!asset.base64,
      base64Length: asset.base64?.length,
      uri: asset.uri,
      width: asset.width,
      height: asset.height
    });
    
    return asset;
  } catch (error) {
    console.error('Error testing image picker:', error);
    Alert.alert('Test Error', `Image picker test failed: ${error}`);
    return null;
  }
};

export const logCameraViewInfo = (cameraRef: any) => {
  console.log('Camera ref info:', {
    isNull: cameraRef.current === null,
    isUndefined: cameraRef.current === undefined,
    type: typeof cameraRef.current,
    hasMethod: cameraRef.current?.takePictureAsync ? 'yes' : 'no'
  });
};
