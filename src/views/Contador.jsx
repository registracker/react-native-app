import { ImageBackground, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { primary, styles } from '../styles/style'
import { Button, Icon, Input } from '@rneui/base'
import { ContadorContext } from '../context/levantamiento/ContadorContext'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import { CatalogosContext } from '../context/store/CatalogosContext'
import { compareAsc, format } from 'date-fns'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'

const Contador = ({ navigation }) => {

    const [levantamiento, setLevantamiento] = useState("dfd2-2359-57ff")
    const [levantamientoErrors, setLevantamientoErrors] = useState()
    const [cargando, setCargando] = useState(false)

    const {
        listado,
        guardar,
        activo,
        levantamiento: levantamientoActivo,
        restablecer,
        enviar
    } = useContext(ContadorContext)

    const [vehiculos, setVehiculos] = useState()
    const [contadorVehicular, setContadorVehicular] = useState([])
    const [modalVisible, setModalVisible] = useState(false)

    const unirseLevantamiento = async () => {
        setCargando(true)
        if (levantamiento) {
            const response = await guardar(levantamiento);
            if (response) {
                response.forEach(element => {
                    element.contador = 0
                });
                setVehiculos(response)
            }
        } else {
            setLevantamientoErrors('Debe ingresar un código de levantamiento')
        }
        setCargando(false)
    }


    const borrarVehiculo = (id) => {
        const contador = [...contadorVehicular]
        const reversedArray = contador.slice().reverse();
        const index = reversedArray.findIndex((item) => item.id_vehiculo === id);
        if (index !== -1) {
            const originalIndex = contador.length - 1 - index;
            contador.splice(originalIndex, 1);
            setContadorVehicular(contador)
        }
    }

    const cerrarConteo = async () => {
        await restablecer();
        setModalVisible(!modalVisible)
        restablecerContador()
    }

    const verificar = async () => {
        const previo = await AsyncStorage.getItem('levantamiento-contador')
        if (previo) {
            const levantamiento = JSON.parse(previo);
            const { periodo_fin } = levantamiento
            const [year, month, day] = periodo_fin.split('-');
            const fecha = new Date(year, month - 1, day);
            const valido = compareAsc(fecha, new Date())
            if (valido === 1) {
                await guardar(levantamiento.codigo);
            } else {
                await restablecer()
            }
        }
    }

    const sumar = (index) => {
        const contador = [...vehiculos]
        contador[index].contador = contador[index].contador + 1
        setVehiculos(contador);
        agregarRegistro(contador[index].id);
    }

    const agregarRegistro= (id) => {
        const registro = {
            id_levantamiento_contador: levantamientoActivo.id,
            id_vehiculo: id,
            registrado: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        }
        const newArray = [...contadorVehicular, registro]
        setContadorVehicular(newArray);
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
        console.log(contadorVehicular.length);
        await enviar(contadorVehicular);
        setContadorVehicular([])
    }

    const SaveIcon = useCallback(
      () => {
        
        return (
            <View style={{ position: 'absolute', top: 10, right: 10 }}>
                <Icon onPress={guardarRegistros} type='material-community' name='content-save' color={primary} size={40} />
            </View>
        )
      },
      [contadorVehicular],
    )
    

    const restablecerContador = () => {
        listado.forEach(element => {
            element.contador = 0
        });
        setVehiculos(listado)
        setContadorVehicular([])
        setModalVisible(!modalVisible)
    }

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
        if (contadorVehicular.length === 0) {
            console.log("Vacio");
        }
    }, [contadorVehicular])

    useEffect(() => {
        setVehiculos([...listado])
    }, [listado])

    // useEffect(() => {
    //     console.log(JSON.stringify(contadorVehicular, null, 2));
    // }, [contadorVehicular])

    useFocusEffect(
        React.useCallback(() => {
            // Función a ejecutar al cambiar a la pestaña Profile
            // console.log('Cambiaste a la pestaña Conteo');

            // Lógica adicional aquí

            return () => {
                // Función a ejecutar al salir de la pestaña Profile
                // console.log('Save');

                // Lógica adicional aquí
            };
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
                                <SaveIcon />
                            </View> :
                            <View style={styles.modalView}>
                                <Text style={styles.chip}>Contador</Text>
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
                                        title='Unirse'
                                        onPress={unirseLevantamiento}
                                        disabledStyle={styles.buttonPrimaryDisabled}
                                        loading={cargando}
                                        type="clear"
                                        titleStyle={{ color: primary }}
                                    />
                                </View>
                            </View>
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
                            <Text style={styles.textBlack}>Ajustes</Text>
                            <TouchableOpacity style={{ width: '100%', height: 35, justifyContent: 'center', alignItems: 'center' }}>
                                <Text>
                                    Configurar Catálogos de vehiculos
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={restablecerContador} style={{ width: '100%', height: 35, justifyContent: 'center', alignItems: 'center' }}>
                                <Text>
                                    Restablecer contador
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={cerrarConteo} style={{ width: '100%', height: 35, justifyContent: 'center', alignItems: 'center' }}>
                                <Text>
                                    Cerrar conteo vehicular
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)} style={{ width: '100%', height: 35, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: primary }}>
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
