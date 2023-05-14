import { Modal, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useContext } from 'react'

import { DesplazamientoContext } from '../context/tracking/DesplazamientoContext'
import { FlatList } from 'react-native-gesture-handler'
import { Button, Icon } from '@rneui/base'

import { primary, styles } from '../styles/style';
import { useState } from 'react'
import { Input } from '@rneui/themed'
import { useBackHandler } from '@react-native-community/hooks'


const CostoDesplazamientos = ({ navigation }) => {

    const { listMedios, aumentarCostoDesplazamiento, reducirCostoDesplazamiento, agregarCostoDesplazamiento } = useContext(DesplazamientoContext)
    const [modalVisible, setModalVisible] = useState(false);

    const [aumento, setAumento] = useState(0.05)
    const [reducir, setReducir] = useState(0.05)
    const [indexItem, setIndexItem] = useState()

    const [cantidad, setCantidad] = useState()
    const [mensajeError, setMensajeError] = useState()

    const { enviarDesplazamiento } = useContext(DesplazamientoContext)

    const editarCosto = (index) => {
        setModalVisible(true);
        setIndexItem(index);
    }

    const ingresarCosto = (cantidad) => {
        if (!isNaN(parseFloat(cantidad)) && (parseFloat(cantidad) % 1 !== 0 || Number.isInteger(parseFloat(cantidad)))) {
            agregarCostoDesplazamiento(indexItem, parseFloat(cantidad))
            setModalVisible(false);
            setIndexItem();
            setCantidad()
        }
        else {
            setMensajeError('La cantidad ingresa no es valida.')
            setCantidad()
        }
    }

    const Item = ({ data, index }) => (
        <View style={stylesCosto.item}>
            <View style={stylesCosto.elements}>
                <Icon name={data.icono} type='material-community' size={25} color="gray" />
                <Text style={stylesCosto.title}>{data.nombre}</Text>
            </View>
            <View style={stylesCosto.elements}>
                <Icon name='arrow-up-drop-circle' type='material-community' size={25} color={primary} onPress={() => aumentarCostoDesplazamiento(index, aumento)} />
                <Text
                    style={stylesCosto.title}
                    onPress={() => editarCosto(index, aumento)}
                >$ {parseFloat(data.costo, 10).toFixed(2)}</Text>
                <Icon name='arrow-down-drop-circle' type='material-community' size={25} color={primary} onPress={() => reducirCostoDesplazamiento(index, reducir)} />
            </View>
        </View>
    );

    const finalizar = () => {
        enviarDesplazamiento()
        navigation.navigate('TabNavegacion')
    }

    useBackHandler(() => {
        enviarDesplazamiento()
        return true;
    })

    useEffect(() => {

        navigation.setOptions({
            headerLeft: () => (
                <Icon 
                onPress={() => { enviarDesplazamiento(); navigation.navigate('TabNavegacion'); }} 
                type="ionicons" 
                color='white' 
                name='arrow-back' 
                style={{marginRight: 5}}
                />
            ),
        });
    }, [navigation])



    return (
        <View style={stylesCosto.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setCantidad()
                    setMensajeError()
                    setModalVisible(!modalVisible);
                }}>
                <View style={stylesCosto.centeredView}>
                    <View style={stylesCosto.modalView}>
                        <Text style={stylesCosto.modalText}>Costo del medio de transporte</Text>
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
                        <View style={{ flexDirection: 'row' }}>

                            <Button
                                title='Continuar'
                                onPress={() => ingresarCosto(cantidad)}
                                buttonStyle={styles.buttonPrimary}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
            <View style={stylesCosto.body}>
                <View style={{ justifyContent: 'center', marginHorizontal: 10 }}>
                    <Text style={stylesCosto.modalText} >Definir costo de desplazamientos</Text>
                    <FlatList
                        data={listMedios}
                        renderItem={({ item, index }) => <Item data={item} index={index} />}
                        keyExtractor={item => item.id}
                    />
                </View>
                <View>
                    <Button
                        title='Omitir'
                        buttonStyle={styles.buttonSecondary}
                        onPress={() => navigation.navigate('TabNavegacion')}
                    />
                    <Button
                        title='Continuar'
                        buttonStyle={styles.buttonPrimary}
                        onPress={() => finalizar()}
                    />
                </View>
            </View>
        </View>
    )
}

export default CostoDesplazamientos

const stylesCosto = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
        alignContent: 'space-between',
    },
    body: {
        flex: 1,
        justifyContent: 'space-around',
        alignContent: 'center',
        width: '100%',
    },
    item: {
        backgroundColor: '#e1e1e1',
        padding: 15,
        marginVertical: 2,
        borderRadius: 5,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',

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