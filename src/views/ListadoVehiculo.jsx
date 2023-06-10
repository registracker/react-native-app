import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useContext } from 'react'
import { CatalogosContext } from '../context/store/CatalogosContext'
import { useState } from 'react'
import { Button, CheckBox, Icon } from '@rneui/base'
import MultiSelect from 'react-native-multiple-select'
import { primary, styles } from '../styles/style'
import { ContadorContext } from '../context/levantamiento/ContadorContext'
import { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { showToast } from '../utils/toast'
import { FlatList } from 'react-native-gesture-handler'
import { CANT_VEHICULOS } from '@env';

export default ListadoVehiculo = ({ navigation }) => {


    const { ctl_vehiculos } = useContext(CatalogosContext)
    const { actualizarListado } = useContext(ContadorContext)

    const [selectedItems, setSelectedItems] = useState([]);
    const [cantidad] = useState(CANT_VEHICULOS)

    const onSelectedItemsChange = (item) => {

        if (selectedItems.includes(item)) {
            const selecteds = selectedItems.filter(elemento => elemento !== item);
            setSelectedItems(selecteds); 
            return;
        }


        if (selectedItems.length < cantidad) {
            setSelectedItems([...selectedItems, item]);
        } else {
            showToast('No se permiten mas de tres vehículos');            
        }
    };

    const guardarVehiculos = () => {

        if (selectedItems.length > 0) {
            actualizarListado(selectedItems)
            showToast('Vehiculos seleccionados');            
            navigation.navigate('Contador')
        }else {
            showToast('No ha seleccionado ningún vehículo');            
        }

    }

    useEffect(() => {
        const obtenerLista = async () => {
            const vehiculos = await AsyncStorage.getItem('listado-vehiculos')
            const lista = vehiculos != null ? JSON.parse(vehiculos) : null
            if(lista) {
                setSelectedItems(lista)
            }
        }
        obtenerLista()

    }, [])


    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity >
                <View>
                    <CheckBox
                        title={item.nombre}
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        checkedColor={primary}
                        checked={selectedItems.includes(item.id)}
                        onPress={() => onSelectedItemsChange(item.id)}
                    />
                </View>
            </TouchableOpacity>
        );
    };



    return (
        <View style={styles.container}>
            <View style={{ padding: 10, flex:0.9 }}>
                <FlatList
                    data={ctl_vehiculos.data}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                />
            </View>
            <View style={{width: '100%' }}>

                <Button
                    onPress={() => guardarVehiculos(selectedItems)}
                    title={'Continuar'}
                    buttonStyle={styles.buttonPrimary}
                />
            </View>

        </View>
    )
}