/* eslint-disable prettier/prettier */
import { StatusBar, StyleSheet } from 'react-native';

const primary = '#8f0c1e'
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
    flex: 10,
    padding: 20,
    paddingTop: StatusBar.currentHeight,
  },
  toolbar: {
    flexDirection: 'row',
    borderWidth: 2,
    justifyContent: 'space-between',
  },
  foobar: {
    flex: 2,
    alignItems: 'center',
  },
  image: {
    resizeMode: 'contain',
    height: 200,
    width: 400,
    marginVertical: 10,
  },
  titleText: {
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    // fontStyle: 'italic',
    color: 'white',
    // borderWidth: 4,
    // borderColor: '#20232a',
    // borderRadius: 10,
    // paddingVertical: 8,
    // paddingHorizontal:10
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
    borderWidth: 2,
    padding: 10,
    height: 40,
    width: '80%',
    borderRadius: 5,
    borderColor: 'white',
    paddingBottom:0,
    color: 'white',
  },
  buttonPrimary: {
    backgroundColor: primary,
    borderRadius: 3,
  },
  buttonPrimaryDisabled: {
    backgroundColor: primaryDisabled,
    borderRadius: 3,
  },
  buttonSecondary: {
    backgroundColor: secondary,
    borderRadius: 3,
  },
  buttonSecondaryDisabled: {
    backgroundColor: 'rgb(180, 173, 255)',
    borderRadius: 3,
  },
  buttonContainer: {
    width: '80%',
    marginHorizontal: 50,
    marginVertical: 10,
  },
  roundButtonDesplazamiento: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    backgroundColor: 'white',
  },
  roundButtonDesplazamientoSelected: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    backgroundColor: 'white',
    borderColor:primary,
    borderWidth: 5,
  },
});
