/* eslint-disable prettier/prettier */
import { StatusBar, StyleSheet } from 'react-native';

export const primary = '#8f0c1e'
const primaryDisabled = 'grey'
const secondary = '#7a7a7a'
const secondaryDisabled = '#adadad'

export const styles = StyleSheet.create({
  primary,
  secondary,
  container: {
    flex: 1,
  },
  body: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 10,
    padding: 10,
    paddingTop: StatusBar.currentHeight,
  },
  foobar: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  image: {
    resizeMode: 'contain',
    width: '60%',
    height: '60%',
    marginVertical: 10,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 5,
    color: 'white',
  },
  subtitleText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 30,
    marginHorizontal: 20,
    color: 'gray',
  },
  input: {
    height: 60,
    width: '80%',
    color: 'black',
  },
  inputContainer: {
    borderWidth: 2,
    padding: 10,
    height: 40,
    borderRadius: 5,
    borderColor: 'white',
    color: 'white',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  inputContainerError: {
    borderWidth: 2,
    padding: 10,
    height: 40,
    borderRadius: 5,
    borderColor: primary,
    color: 'white',
    alignItems: 'center',
    backgroundColor: 'white',

  },
  errorStyle: {
    fontSize: 12
  },
  buttonPrimaryDisabled: {
    backgroundColor: primaryDisabled,
    borderRadius: 3,
  },
  buttonContainer: {
    width: '80%',
    marginHorizontal: 50,
    marginVertical: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  textBlack: {
    color: 'black',
    textAlign: 'center',
    fontSize: 18,
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
  },
  modalText: {
    color: 'black',
    textAlign: 'center',
    width: '100%',
  },
  modalTextTitle: {
    fontSize: 30,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalTextSubtitle: {
    color: 'gray',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
    borderColor: primary,
    borderWidth: 3,
    margin:5
  },
  iconos: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    backgroundColor: 'white',
  },
  iconoSelected: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: 'white',
    borderColor: primary,
    borderWidth: 3,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: 'white',
  },
  titleBlack: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 5,
    color: 'black',
  },
  buttonPrimary: {
    backgroundColor: primary,
    borderRadius: 15,
    marginHorizontal: 5,
    padding: 10,
  },
  buttonSecondary: {
    backgroundColor: secondary,
    borderRadius: 15,
    marginHorizontal: 5,
    padding: 10,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  customButtom: {
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 20,
    width: 150,
    height: 180,
    backgroundColor: 'green',
    borderColor: 'white',
    paddingTop: 0,
    paddingHorizontal: 0,
    marginHorizontal: 5,
    marginBottom: 0,
  },
  customButtomDisabled: {
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 20,
    width: 130,
    height: 160,
    backgroundColor: '#999999',
    borderColor: 'white',
    paddingTop: 0,
    paddingHorizontal: 0,
    marginHorizontal: 5,
    marginBottom: 0,
  },
  row: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    margin: 5,
  },
  chip: {
    borderWidth: 2,
    borderColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: primary,
    borderRadius: 25,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: 'white',
    flexDirection: 'row',
  },
  card: {
    borderWidth: 2,
    borderColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'white',
    borderRadius: 25,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: 'white',
  },
  item: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 2,
    borderRadius: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: primary
  },
});
