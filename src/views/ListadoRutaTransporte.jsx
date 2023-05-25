import { ActivityIndicator, Alert, BackHandler, ImageBackground, Keyboard, Modal, StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { primary, styles } from '../styles/style';
import { FlatList } from 'react-native-gesture-handler';
import { Button, Icon } from '@rneui/base';
import { Input } from '@rneui/themed';

import { postBuscarRutasTransporteInstance } from '../services/rutasTransporteService'
import { color } from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native';

import { useBackHandler } from '@react-native-community/hooks'
import { DesplazamientoContext } from '../context/tracking/DesplazamientoContext';
import { showToast } from '../utils/toast';


const ListadoRutaTransporte = ({ navigation }) => {

    const [ruta, setRuta] = useState()
    const [rutaErrors, setRutaErrors] = useState()

    const [resultado, setResultado] = useState()
    const [siguiente, setSiguiente] = useState()
    const [loading, setLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)

    const [seleted, setSeleted] = useState()

    const { actualizarMedioDesplazamiento } = useContext(DesplazamientoContext)

    const seleccionarRuta = (item) => {
        setModalVisible(true)
        setSeleted(item)
    }

    const buscar = async () => {
        setLoading(true)
        Keyboard.dismiss();
        if (!ruta) {
            setRutaErrors('Campo de busqueda esta vacio')
            setLoading(false)
            return;
        }
        const page = siguiente ? siguiente.split('?')[1] : null
        if (page) {

            const { data, links } = await postBuscarRutasTransporteInstance(ruta, page)
            if (data) {
                setResultado([...resultado, ...data])
                showToast('Resultado encontrados');
            } 
            setSiguiente(links?.next)
        } else {
            const { data, links } = await postBuscarRutasTransporteInstance(ruta)
            if (data) {
                setResultado(data)
                showToast('Resultado encontrados');
            }
            setSiguiente(links?.next)
        }
        setLoading(false)
    }

    const restaurar = () => {
        setResultado([])
        setSeleted()
    }

    const actualizarMedio = () => {
        actualizarMedioDesplazamiento(seleted)
        restaurar()
        showToast('Ruta de transporte almacenada');
        navigation.navigate('TabNavegacion')
    }

    const buscarSiguiente = async () => {
        if (siguiente == null || siguiente === undefined) {
            return;
        }
        await buscar();
    }

    const Item = ({ data, index }) => (
        <TouchableOpacity
            style={stylesRegistro.item}
            onPress={() => seleccionarRuta(data)}
            onLongPress={() => seleccionarRuta(data)}
            activeOpacity={0.4}
        >
            <View style={stylesRegistro.elements}>
                <Icon name='bus' type='material-community' size={30} color={primary} />
                <View>
                    <Text style={styles.textBlack}>Ruta:{data.ruta}</Text>
                    <Text style={styles.textBlack}>{data.codigo_ruta}</Text>
                </View>
            </View>
            <View style={stylesRegistro.elements}>
                <Text
                    style={styles.textBlack}
                >$ {parseFloat(data.tarifa_autorizada, 10).toFixed(2)}</Text>
            </View>
        </TouchableOpacity>
    );

    const EmptyList = () => {
        return <Text style={styles.text}>Sin datos</Text>
    }

    const FooterList = () => {
        <TouchableOpacity
            style={stylesRegistro.item}
            onPress={() => buscarSiguiente()}
            activeOpacity={0.4}
            >
            <View style={stylesRegistro.elements}>
                <View>
                    <Text style={styles.textBlack}>Buscar</Text>
                </View>
            </View>
        </TouchableOpacity>
    }


    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../img/fondo.png')}
                resizeMode="cover"
                style={styles.imageBackground}
            >
                <View style={styles.body}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', margin: 20 }}>
                        <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
                            <Input
                                onChangeText={setRuta}
                                value={ruta}
                                autoCapitalize='none'
                                placeholder={rutaErrors ? rutaErrors : "Ruta, código o departamento"}
                                inputMode="text"
                                textAlign='center'
                                style={{ ...styles.input, width: '50%' }}
                                errorMessage={rutaErrors}
                                leftIcon={rutaErrors ? <Icon name="information-outline" type='material-community' size={20} color={primary} /> : <Icon name="search" type='ionicons' size={20} color={primary} />}
                                errorStyle={rutaErrors ? stylesRegistro.errorStyle : null}
                                inputContainerStyle={setRutaErrors ? styles.inputContainerError : styles.inputContainer}
                                onFocus={() => { setRutaErrors() }}
                            />
                            <Icon name="search" type='ionicons' size={35} color={primary} onPress={buscar} />
                        </View>
                        {
                            loading ?
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <ActivityIndicator size="large" color={primary} />
                                </View>
                                : <FlatList
                                    data={resultado}
                                    renderItem={({ item, index }) => <Item data={item} index={index} />}
                                    keyExtractor={item => item.id}
                                    ListEmptyComponent={<EmptyList />}
                                    ListFooterComponent={<FooterList />}
                                    style={{ width: '100%' }}
                                />
                        }
                        <Modal
                            animationType="fade"
                            visible={modalVisible}
                            transparent={true}
                            statusBarTranslucent={true}
                            onRequestClose={() => {
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <Text style={styles.textBlack}>Ruta: {seleted?.ruta} - Código: {seleted?.codigo_ruta}</Text>
                                    <Text style={styles.textBlack}>Denominación: {seleted?.denominacion}</Text>
                                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center' }}>
                                        <Button
                                            title={'Cerrar'}
                                            buttonStyle={styles.buttonSecondary}
                                            onPress={() => setModalVisible(false)}
                                        />
                                        <Button
                                            title={'Guardar'}
                                            disabled={!seleted}
                                            buttonStyle={styles.buttonPrimary}
                                            onPress={() => actualizarMedio()}
                                        />

                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </View>
                </View>

            </ImageBackground>
        </View>
    )
}

export default ListadoRutaTransporte


const stylesRegistro = StyleSheet.create({
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
        marginHorizontal: 10,
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
    seleted: {
        backgroundColor: '#e1e1e1',
        padding: 15,
        marginVertical: 2,
        borderRadius: 5,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        borderColor: primary,
        borderWidth: 2
    }
});