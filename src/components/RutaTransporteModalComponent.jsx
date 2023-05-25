import { View, Text, Modal, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { primary, styles } from '../styles/style';
import { Button } from '@rneui/base';
import { NavigationContext } from '@react-navigation/native';
import { useContext } from 'react';


export default function RutaTransporteModalComponent({ open, setOpen }) {

  const navigation = useContext(NavigationContext)

  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        statusBarTranslucent={true}
        visible={open}
        onRequestClose={() => {
          setOpen(!open);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.card}>
              <Text style={styles.titleBlack}>¿Deseas agregar la ruta de transporte?</Text>
              <Text style={styles.textBlack}>Puedes agregar el costo recomendado por las autoridades de la ruta de transporte en que te desplazas</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Button title="Omitir" type="clear" titleStyle={{ color: 'gray' }} onPress={() => { setOpen(!open) }} />
              <Button title="Sí, seguro" type="clear" titleStyle={{ color: primary }} onPress={() => {
                navigation.navigate('ListadoRutaTransporte')
                setOpen(!open)
              }} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}