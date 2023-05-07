import { View, Text, Modal, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { primary, styles } from '../styles/style';
import { BottomSheet, Button, Icon, ListItem } from '@rneui/base';
import { useState } from 'react';
import { Input } from '@rneui/themed';

import {postBuscarRutasTransporte} from '../services/rutasTransporteService.js';
import { FlatList } from 'react-native-gesture-handler';

export default function RutaTransporteModalComponent({ open, setOpen }) {

  const [isVisible, setIsVisible] = useState(false);
  const [filtro, setFiltro] = useState('ruta')
  const [buscar, setBuscar] = useState()

  const [rutasTransporte, setRutasTransporte] = useState()
  const [selectedId, setSelectedId] = useState();


  const addfiltro = (filtro) => {
    setFiltro(filtro)
    setIsVisible(false)
  }

  const list = [
    {
      title: 'Ruta',
      onPress: () => addfiltro('ruta'),
    },
    {
      title: 'Nombre Ruta',
      onPress: () => addfiltro('nombre_ruta'),
    },
    {
      title: 'Departamento',
      onPress: () => addfiltro('departamento'),
    },
    {
      title: 'Cancelar',
      containerStyle: { backgroundColor: 'red' },
      titleStyle: { color: 'white' },
      onPress: () => setIsVisible(false),
    },
  ];

  const buscarRuta = async() => { 
    console.log(filtro, buscar) ;
    const data = {
      "filters": [
        {
          "field": filtro,
          "operator": "like",
          "value": buscar
        }
      ]
    }

    const response = await postBuscarRutasTransporte(data)

    setRutasTransporte(response)
   }


  const renderItem = ({ item }) => {
    const backgroundColor = item.id === selectedId ? '#6e3b6e' : '#f9c2ff';
    const color = item.id === selectedId ? 'white' : 'black';

    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.id)}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        statusBarTranslucent={true}
        visible={open}
        onRequestClose={() => {
          setOpen(!open);
        }}>
        <View style={styleTransporte.centeredView}>
          <View style={styleTransporte.modalView}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Button
                title="Filtros"
                onPress={() => setIsVisible(true)}
                radius='lg'
                buttonStyle={{ backgroundColor: primary, marginBottom: 12 }}
                icon={<Icon name="text-search" type='material-community' color='white' size={20} />}
              />
              <Input
                containerStyle={{ width: '80%', paddingBottom: 0 }}
                leftIconContainerStyle={{}}
                rightIcon={<Icon name="close" size={20} />}
                placeholder='Buscar...'
                onChangeText={setBuscar}
                value={buscar}
              />
            </View>
            {/* <FlatList
              data={rutasTransporte}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              extraData={selectedId}
            /> */}
              <Button
                title="Buscar"
                onPress={buscarRuta}
                buttonStyle={styles.buttonPrimary}
                disabledStyle={styles.buttonPrimaryDisabled}
                // loading={cargando}
                // disabled={!validLogin}
                radius="lg"
                containerStyle={styles.buttonContainer}
              />
            <BottomSheet modalProps={{}} isVisible={isVisible}>
              {list.map((l, i) => (
                <ListItem
                  key={i}
                  containerStyle={l.containerStyle}
                  onPress={l.onPress}
                >
                  <ListItem.Content>
                    <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                  </ListItem.Content>
                </ListItem>
              ))}
            </BottomSheet>
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
  modalView: {
    margin: 10,
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
  },
  // input: {
  //   height: 40,
  //   width: '20%',
  //   paddingBottom: 8,
  //   color: 'white',
  // },
});