/* eslint-disable prettier/prettier */
import {StatusBar, StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  toolbar: {
    flexDirection: 'row',
    borderWidth: 3,
    justifyContent: 'space-between',
  },
  body: {
    alignItems: 'center',
    flex: 6,
    padding: 20,
    paddingTop: StatusBar.currentHeight,
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
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  subtitleText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 30,
    marginHorizontal: 20,
    color: 'gray',
  },
});
