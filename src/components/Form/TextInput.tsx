import React, { useEffect } from "react";
import { View, TextInput as RNTextInput, StyleSheet, Platform, TextInputProps as RNTextInputProps } from "react-native";
import { useFonts, WorkSans_400Regular } from "@expo-google-fonts/dev";
import { useFormikContext } from "formik";

import { colors } from "../../config";

import { Text } from "../Text";
import { Spacer } from "../Spacer";

import { FormHelper } from "../../helpers";

interface TextInputProps extends RNTextInputProps {
  width?: string;
  name: string;
  border?: boolean;
  removePaddingMargin?: boolean;
  borderRadius?: number;
}

export const TextInput = ({
  name,
  width = "100%",
  border = true,
  removePaddingMargin = false,
  borderRadius = 40,
  ...otherProps
}: TextInputProps) => {
  const [fontLoaded] = useFonts({ WorkSans_400Regular });
  const [focus, setFocus] = React.useState(true);
  const { setFieldTouched, setFieldValue, errors, touched, values, status, setValues, handleReset, handleSubmit } =
    useFormikContext<any>();

  const handleTouch = () => {
    setFieldTouched(name);
    setFocus(true);
  };

  const handleChange = (text: string) => {
    if (!isNaN(name)) {
      setFieldValue(name, { text, optionId: null });
    } else {
      setFieldValue(name, text);
    }
  };

  const handleFocus = () => {
    setFocus(false);
  };

  return (
    <>
      <View
        style={[
          styles.container,
          { width },
          { borderRadius },
          border && (touched[name] && errors[name] ? styles.errorBorder : styles.defaultBorder),
          border && !focus && styles.focusedBorder,
          removePaddingMargin && styles.noPaddingMargin,
        ]}
      >
        <Text font="NotoSans_400Regular" variant="subText" size="overline">
          {isNaN(name) ? FormHelper.getLabelFromResponseField(name) : ""}
        </Text>
        <RNTextInput
          selectionColor="black"
          placeholderTextColor="#B0B9C3"
          onFocus={handleFocus}
          onBlur={handleTouch}
          onChangeText={handleChange}
          value={isNaN(name) ? values[name] : values[name]?.text}
          enablesReturnKeyAutomatically={true}
          returnKeyType="done"
          style={[styles.textInput, fontLoaded ? styles.customFont : styles.defaultFont, otherProps.style]}
          {...otherProps}
        />
      </View>
      {errors[name] && touched[name] && (
        <View style={{ paddingTop: 4 }}>
          <Text font="Poppins_400Regular" variant="error" size="caption_one">
            {`${errors[name]}`}
          </Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 14,
    paddingTop: 4,
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 40,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignContent: "flex-start",
    minHeight: 60,
  },
  noPaddingMargin: {
    padding: 0,
    paddingHorizontal: 0,
    paddingBottom: 0,
    paddingTop: 0,
    borderRadius: 0,
  },
  textInput: {
    color: colors.black,
    fontSize: 17,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignContent: "flex-start",
    flex: 1,
    textAlignVertical: "top",
  },
  customFont: {
    fontFamily: "WorkSans_400Regular",
  },
  defaultFont: {
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
  },
  errorBorder: {
    borderWidth: 1,
    borderColor: colors.error,
  },
  focusedBorder: {
    borderWidth: 1,
    borderColor: colors.black,
  },
  defaultBorder: {
    borderWidth: 1,
    borderColor: colors.tertiaryText,
  },
  icon: {
    marginRight: 10,
  },
});
