import React, { useState } from 'react'
import { Button, Icon } from '@rneui/base';
import { useContext } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import { styles } from '../styles/style';
import { AuthContext } from '../context/Auth/AuthContext'



export const Ajustes = () => {

  const { logout } = useContext(AuthContext)

  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false)


  const cerrarSesion = () => {
    setLoading(true);
    logout();
  }

  return (
    <View style={styles.container}>
      <View style={styles.body}>

        <Text>
          AJUSTES
        </Text>
      </View>
      <View style={styles.foobar}>
        <Button
          title="Cerrar sesión"
          type="clear"
          onPress={() => { setModalVisible(true) }}
          titleStyle={{ color: 'white' }}
          icon={
            <Icon
              name="logout"
              type="material-community"
              size={15}
              color="white"
            />
          }
          iconRight
        />
      </View>
      <Modal
        animationType="fade"
        visible={modalVisible}
        statusBarTranslucent={true}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={stylesAjustes.centeredView}>
          <View style={stylesAjustes.modalView}>
            <Text style={stylesAjustes.modalText}>¿Salir de tu cuenta?</Text>
            <View style={{
              flexDirection: 'row'
            }}>
              {
                loading ? (
                  <ActivityIndicator size="large" color={styles.primary} />
                ) : (
                  <>
                    <Button title="Cancelar" type="clear" onPress={() => { setModalVisible(!modalVisible) }} />
                    <Button title="Salir" type="clear" titleStyle={{ color: 'red' }} onPress={() => { cerrarSesion() }} />
                  </>
                )
              }

            </View>
          </View>
        </View>
      </Modal>

    </View>
  )
}

const stylesAjustes = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textStyleSalir: {
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});