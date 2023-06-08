import { ActivityIndicator, ImageBackground, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { primary, styles } from '../styles/style'
import { Badge, Button, FAB, Icon, Input } from '@rneui/base'
import { ContadorContext } from '../context/levantamiento/ContadorContext'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import { CatalogosContext } from '../context/store/CatalogosContext'
import { compareAsc, format } from 'date-fns'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
import { NetworkContext } from '../context/network/NetworkContext'
import { showToast } from '../utils/toast'

const Contador = ({ navigation }) => {

    const [levantamiento, setLevantamiento] = useState()
    const [levantamientoErrors, setLevantamientoErrors] = useState()
    const [cargando, setCargando] = useState(false)
    const [cantidad, setCantidad] = useState(0)

    const {
        listado,
        guardar,
        activo,
        levantamiento: levantamientoActivo,
        restablecer,
        enviar,
        conectarse,
        agregarRegistro,
        contador,
        actualizarConteo
    } = useContext(ContadorContext)

    const { isConnected } = useContext(NetworkContext)


    const [vehiculos, setVehiculos] = useState([])
    const [contadorVehicular, setContadorVehicular] = useState([])
    const [modalVisible, setModalVisible] = useState(false)
    const [loading, setLoading] = useState(false)


    const unirseLevantamiento = async () => {
        setCargando(true)
        if (levantamiento) {
            const response = await guardar(levantamiento);
            if (response) {
                response.forEach(element => {
                    element.contador = 0
                });
                setVehiculos(response)
                showToast('Levantamiento ingresado exitosamente');
            }
        } else {
            setLevantamientoErrors('Debe ingresar un código de levantamiento')
        }
        setCargando(false)
    }


    const borrarVehiculo = (id) => {
        const ct = [...contador]
        const reversedArray = ct.slice().reverse();
        const index = reversedArray.findIndex((item) => item.id_vehiculo === id);
        if (index !== -1) {
            const originalIndex = ct.length - 1 - index;
            ct.splice(originalIndex, 1);
            actualizarConteo(ct)
        }
    }

    const cerrarConteo = async () => {
        await restablecer();
        setModalVisible(!modalVisible)
        showToast('Conteo vehicular finalizado');
        restablecerContador()
    }

    const verificar = async () => {
        setLoading(true)
        const previo = await AsyncStorage.getItem('levantamiento-contador')
        if (previo) {
            const levantamiento = JSON.parse(previo);
            const { periodo_fin } = levantamiento
            const [year, month, day] = periodo_fin?.split('-');
            const fecha = new Date(year, month - 1, day);
            const valido = compareAsc(fecha, new Date())
            if (valido === 1) {
                if (isConnected) {
                    await guardar(levantamiento.codigo);
                } else {
                    await conectarse()
                }
            } else {
                showToast('Código de levantamiento no vigente');
                await restablecer()
            }
        } else {
            await restablecer()
        }
        setLoading(false)
    }

    const sumar = (index) => {
        const contador = [...vehiculos]
        contador[index].contador = contador[index].contador + 1
        setVehiculos(contador);
        agregarRegistro(contador[index].id);
    }


    const restar = (index) => {
        const contador = [...vehiculos]
        if (contador[index].contador > 0) {
            contador[index].contador = contador[index].contador - 1
            setVehiculos(contador);
            borrarVehiculo(vehiculos[index].id);
        }
    }

    const guardarRegistros = async () => {
        if (contadorVehicular.length > 0) {
            await enviar(contadorVehicular);
        }
    }

    const restablecerContador = () => {
        listado.forEach(element => {
            element.contador = 0
        });
        setVehiculos(listado)
        setModalVisible(false)
        showToast('Contador vehicular restablecido');
    }


    const SaveIcon = useCallback(
        () => {

            return (
                <View style={{ position: 'absolute', top: 10, left: 10, backgroundColor: primary, borderRadius: 5 }}>
                    <Icon onPress={guardarRegistros} type='material-community' name='content-save' color={'white'} size={40} />
                </View>
            )
        },
        [contadorVehicular],
    )

    const FlatListVehiculos = useCallback(() => {
        return (
            <FlatList
                data={vehiculos}
                renderItem={({ item, index }) => <Item data={item} index={index} />}
                keyExtractor={item => item.id}
                style={{ width: '100%' }}
                ListEmptyComponent={<EmptyList />}
            />
        )
    }, [vehiculos])

    useEffect(() => {
        verificar()
    }, [])


    useEffect(() => {
        if (listado?.length > 3) {
            navigation.navigate('ListadoVehiculo')
        }
        setVehiculos(listado)
    }, [listado])

    useEffect(() => {
        setContadorVehicular(contador);

    }, [contador])

    useEffect(() => {
        setCantidad(contadorVehicular.length)
    }, [contadorVehicular])
    

    useFocusEffect(
        React.useCallback(() => {
            return () => guardarRegistros()
        }, [])
    );


    useEffect(() => {

        navigation.setOptions({
            headerRight: () => (
                <>
                    {
                        activo &&
                        <TouchableOpacity onPress={() => { setModalVisible(true) }} style={{ width: 100, alignItems: 'center', flexDirection: 'row', marginRight: 10 }}>
                            <Text style={styles.text}> Ajustes </Text>
                            <Icon
                                name='car-cog'
                                type='material-community'
                                color='white'
                                suppressHighlighting={true}
                            />
                        </TouchableOpacity>
                    }
                </>
            ),
        });
    }, [activo])


    const Item = ({ data, index }) => (
        <View style={{ width: '100%', marginBottom: 20 }} >
            <Text style={{ ...styles.text, borderWidth: 2, borderColor: 'white', padding: 5, backgroundColor: '#474747', borderRadius: 5 }}>{data.nombre}</Text>
            <View style={{ flexDirection: 'row', width: '100%', padding: 5, height: 80, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity
                    style={{ width: '40%', height: '100%', margin: 5, borderRadius: 5, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => restar(index)}
                    activeOpacity={0}
                >
                    <Icon type='material-community' name='minus-thick' color={primary} />
                </TouchableOpacity>
                <View
                    style={{ width: '20%', height: '100%', margin: 5, borderRadius: 5, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}
                >
                    <Text style={styles.textBlack}>{data.contador}</Text>
                </View>
                <TouchableOpacity
                    style={{ width: '40%', height: '100%', margin: 5, borderRadius: 5, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => sumar(index)}
                    delayPressIn={0}
                    activeOpacity={0}
                >
                    <Icon type='ionicons' name='add' color={primary} />
                </TouchableOpacity>
            </View>
        </View>

    );

    const EmptyList = () => (
        <Text color='black' style={styles.textBlack}>NO HAY DATOS</Text>
    )


    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../img/fondo.png')}
                resizeMode="cover"
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    tintColor: 'transparent'
                }}
            >
                <View style={styles.body}>
                    {
                        activo ?
                            <View style={{ width: '100%', borderRadius: 5, justifyContent: 'center', alignItems: 'center', }}>
                                <Text style={styles.chip}>Código: {levantamientoActivo.codigo}</Text>
                                <FlatListVehiculos />
                            </View> :
                            <View style={styles.modalView}>
                                {
                                    loading ?
                                        <ActivityIndicator size="large" color={primary} />
                                        : <>
                                            <Text style={styles.titleBlack}>Contador</Text>
                                            <Text style={styles.textBlack}>Código de levantamiento</Text>
                                            <Input
                                                onChangeText={setLevantamiento}
                                                value={levantamiento}
                                                autoCapitalize='none'
                                                placeholder={levantamientoErrors ? levantamientoErrors : "XXXX-XXXX-XXXX"}
                                                inputMode="text"
                                                textAlign='center'
                                                style={{ ...styles.input, color: 'black' }}
                                                errorMessage={levantamientoErrors}
                                                leftIcon={levantamientoErrors ? <Icon name="information-outline" type='material-community' size={20} color='white' /> : ''}
                                                errorStyle={levantamientoErrors ? styles.errorStyle : null}
                                                inputContainerStyle={setLevantamientoErrors ? styles.inputContainerError : styles.inputContainer}
                                                onFocus={() => { setLevantamientoErrors("") }}
                                            />
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                                                <Button
                                                    title={isConnected ? 'Unirse' : 'Sin conexión'}
                                                    onPress={unirseLevantamiento}
                                                    loading={cargando}
                                                    disabled={!isConnected}
                                                    type="clear"
                                                    titleStyle={{ color: primary }}
                                                />
                                            </View>
                                        </>

                                }
                            </View>
                    }
                    {
                        activo &&
                        <FAB
                            icon={{ name: 'content-save', color: 'white', type: 'material-community' }}
                            size="large"
                            disabled={cantidad === 0 ? true: false}
                            placement='right'
                            upperCase
                            onPress={guardarRegistros}
                            color={primary}
                            title='Guardar'
                        >
                        </FAB>
                    }
                </View>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setCantidad()
                        setMensajeError()
                        setModalVisible(!modalVisible);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.titleBlack}>Ajustes</Text>
                            <TouchableOpacity onPress={() => { setModalVisible(!modalVisible); navigation.navigate('ListadoVehiculo') }} style={{ width: '100%', height: 35, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={styles.textBlack}>
                                    Configurar Catálogos de vehiculos
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={restablecerContador} style={{ width: '100%', height: 35, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={styles.textBlack}>
                                    Restablecer contador
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={cerrarConteo} style={{ width: '100%', height: 35, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={styles.textBlack}>
                                    Cerrar conteo vehicular
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)} style={{ width: '100%', height: 35, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: primary, size: 18 }}>
                                    Cerrar ajustes
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ImageBackground >
        </View >
    )
}

export default Contador