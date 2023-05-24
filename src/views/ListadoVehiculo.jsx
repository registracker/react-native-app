import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useContext } from 'react'
import { CatalogosContext } from '../context/store/CatalogosContext'
import { useState } from 'react'
import { Button, Icon } from '@rneui/base'
import MultiSelect from 'react-native-multiple-select'
import { primary, styles } from '../styles/style'
import { ContadorContext } from '../context/levantamiento/ContadorContext'
import { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default ListadoVehiculo = ({ navigation }) => {


    const { ctl_vehiculos } = useContext(CatalogosContext)
    const { actualizarListado } = useContext(ContadorContext)

    const [selectedItems, setSelectedItems] = useState();

    const onSelectedItemsChange = (selectedItems) => {
        // Set Selected Items
        if (selectedItems.length <= 3) {
            setSelectedItems(selectedItems);
        } else {
            console.log("No puede seleccionar mas 3 vehiculos");
        }
    };

    const guardarVehiculos = () => {

        actualizarListado(selectedItems)
        console.log("object");
        navigation.navigate('Contador')

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



    return (
        <View style={styles.container}>
            <View style={{ padding: 10, flex:0.9 }}>
                {/* <Text style={styles.textBlack}>{JSON.stringify(ctl_vehiculos.data)} </Text> */}
                <MultiSelect
                    hideTags
                    items={ctl_vehiculos.data}
                    uniqueKey="id"
                    onSelectedItemsChange={onSelectedItemsChange}
                    selectedItems={selectedItems}
                    selectText="Vehículos"
                    searchInputPlaceholderText="Buscar vehiculos"
                    tagRemoveIconColor="#CCC"
                    tagBorderColor="#CCC"
                    tagTextColor="#CCC"
                    selectedItemTextColor={primary}
                    selectedItemIconColor={primary}
                    itemTextColor="grey"
                    displayKey="nombre"
                    searchInputStyle={{ color: '#CCC' }}
                    submitButtonColor={primary}
                    submitButtonText="Guardar"
                    selectedText="seleccionados"
                    noItemsText="No se encontraron datos"
                    hideSubmitButton
                    // styleItemsContainer={{margin: 10}}
                    styleListContainer={{ margin: 10 }}
                    styleTextDropdown={{ paddingLeft: 10 }}
                    styleTextDropdownSelected={{ paddingLeft: 10, color: 'black' }}
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