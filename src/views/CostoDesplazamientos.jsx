import { Modal, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useContext } from 'react'

import { DesplazamientoContext } from '../context/tracking/DesplazamientoContext'
import { FlatList } from 'react-native-gesture-handler'
import { Button, Icon } from '@rneui/base'

import { primary } from '../styles/style';
import { useState } from 'react'
import { useEffect } from 'react'
import { Input } from '@rneui/themed'


const CostoDesplazamientos = () => {

    const { listMedios, aumentarCostoDesplazamiento, reducirCostoDesplazamiento, agregarCostoDesplazamiento } = useContext(DesplazamientoContext)
    const [modalVisible, setModalVisible] = useState(false);

    const [aumento, setAumento] = useState(0.05)
    const [reducir, setReducir] = useState(0.05)
    const [indexItem, setIndexItem] = useState()

    const [cantidad, setCantidad] = useState()
    const [mensajeError, setMensajeError] = useState()

    const editarCosto = (index) => {
        setModalVisible(true);
        setIndexItem(index);
    }

    const ingresarCosto = (cantidad) => {
        if (!isNaN(parseFloat(cantidad)) && (parseFloat(cantidad) % 1 !== 0 || Number.isInteger(parseFloat(cantidad)))) {
            agregarCostoDesplazamiento(indexItem, parseFloat(cantidad))
            setModalVisible(false);
            setIndexItem();
        }
        else {
            setMensajeError('La cantidad ingresa no es valida.')
            setCantidad()
        }
    }

    const Item = ({ data, index }) => (
        <View style={styles.item}>
            <View style={styles.elements}>
                <Icon name={data.icono} type='material-community' size={25} color="gray" />
                <Text style={styles.title}>{data.nombre}</Text>
            </View>
            <View style={styles.elements}>
                <Icon name='arrow-up-drop-circle' type='material-community' size={25} color={primary} onPress={() => aumentarCostoDesplazamiento(index, aumento)} />
                <Text
                    style={styles.title}
                    onPress={() => editarCosto(index, aumento)}
                >$ {parseFloat(data.costo, 10).toFixed(2)}</Text>
                <Icon name='arrow-down-drop-circle' type='material-community' size={25} color={primary} onPress={() => reducirCostoDesplazamiento(index, reducir)} />
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View >
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setCantidad()
                    setMensajeError()
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Costo del medio de transporte</Text>
                        <Input
                            containerStyle={{}}
                            disabledInputStyle={{ background: "#ddd" }}
                            inputContainerStyle={{}}
                            errorMessage={mensajeError}
                            errorStyle={{}}
                            errorProps={{}}
                            inputStyle={{}}
                            labelStyle={{}}
                            labelProps={{}}
                            leftIconContainerStyle={{}}
                            rightIcon={<Icon name="close" onPress={() => setCantidad()} size={20} />}
                            rightIconContainerStyle={{}}
                            value={cantidad}
                            onChangeText={setCantidad}
                            placeholder="$0.00"
                            label='Ingresar cantidad'
                            keyboardType='decimal-pad'
                            onFocus={() => setMensajeError()}
                        />

                        <Button
                            title='Continuar'
                            onPress={() => ingresarCosto(cantidad)}
                            buttonStyle={styles.button}
                        />
                    </View>
                </View>
            </Modal>
                <View>
                    <Text>CostoDesplazamientos</Text>
                    <FlatList
                        data={listMedios}
                        renderItem={({ item, index }) => <Item data={item} index={index} />}
                        keyExtractor={item => item.id}
                    />
                </View>
                <View>
                    <Button
                        title='Omitir'
                        buttonStyle={styles.button}
                    />
                    <Button
                        title='Continuar'
                        buttonStyle={styles.button}
                    />
                </View>
            </View>
        </View>
    )
}

export default CostoDesplazamientos

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
        alignContent: 'space-between',
    },
    item: {
        flexDirection: 'row',
        backgroundColor: '#e1e1e1',
        padding: 15,
        marginVertical: 2,
        marginHorizontal: 4,
        justifyContent: 'space-between',
        borderRadius: 5
    },
    elements: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 15,
        marginHorizontal: 10
    },
    button: {
        marginHorizontal: 10,
        marginVertical: 3,
        borderRadius: 5,
        height: '80%'
    },

    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
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
        minHeight: '30%',
        padding: 10,
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});