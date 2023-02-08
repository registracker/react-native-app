/* eslint-disable prettier/prettier */
import {StatusBar, StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#edebff',
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
  input: {
    borderWidth: 1,
    padding: 10,
    height: 40,
    width: '80%',
    margin: 12,
    borderRadius: 15, 
    borderColor: 'rgb(100, 33, 92)',
  }
});
