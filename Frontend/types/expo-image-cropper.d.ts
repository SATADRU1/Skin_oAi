declare module 'expo-image-cropper' {
  import { ComponentType } from 'react';
  import { ViewStyle } from 'react-native';

  export interface ImageEditorProps {
    imageUri: string;
    fixedAspectRatio?: number;
    minimumCropDimensions?: {
      width: number;
      height: number;
    };
    onEditingCancel: () => void;
    onEditingComplete: (result: { uri: string }) => void;
    style?: ViewStyle;
  }

  const ImageEditor: ComponentType<ImageEditorProps>;
  export default ImageEditor;
}
