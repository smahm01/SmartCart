import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    width: "auto",
  },

  activityIndicator: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  header: {
    marginTop: 60,
    marginHorizontal: 30,
  },

  headerText: {
    marginTop: 60,
  },

  title: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 36,
    fontWeight: "800",
    marginBottom: 4,
  },

  subTitle: {
    color: "#A2A2A2",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
  },

  inputBox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "auto",
    borderBottomColor: "#A2A2A2",
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    marginTop: 7,
    marginHorizontal: 30,
  },

  input: {
    marginVertical: 10,
    padding: 10,
    height: 40,
    borderRadius: 4,
    flex: 1,
    backgroundColor: "white",
    fontWeight: "700",
    fontSize: 16,
  },

  focusedInput: {
    transform: [{ scale: 1.05 }],
  },

  invalidInputText: {
    color: "#EF2A39",
    marginTop: 1,
    fontWeight: "bold",
    marginHorizontal: 30,
  },

  invalidInputTextBox: {
    backgroundColor: "#EF2A39",
  },

  invalidInput: {
    borderColor: "#7a151d",
    borderWidth: 2,
    backgroundColor: "#EF2A39",
    borderRadius: 15,
    opacity: 0.65,
  },

  registerButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderColor: "#EF2A39",
    borderWidth: 2,
    borderRadius: 30,
    paddingVertical: 18,
    marginVertical: 60,
    width: 160,
    alignSelf: "flex-end",
    backgroundColor: "#EF2A39",
    marginRight: 30,
  },

  registerButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },

  disabledButton: {
    backgroundColor: "gray",
    borderColor: "gray",
    opacity: 0.6,
  },

  redirect: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  redirectText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },

  redirectButton: {
    color: "#EF2A39",
    fontSize: 16,
    fontWeight: "700",
    paddingLeft: 4,
  },
});
