import { View, Text, Modal, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { styles } from '../styles/style';

export default function RutaTransporteModalComponent({open, setOpen}) {

  
  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={open}
        onRequestClose={() => {
          setOpen(!open);
        }}>
        <View style={styleTransporte.modal}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Hello World!</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setOpen(!open)}>
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  )
}


const styleTransporte = StyleSheet.create({
  head: {
    flex: 0.1,
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  footer: {
    flex: 0.3,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',

  },
});