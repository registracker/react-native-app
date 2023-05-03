import { Button, Icon } from '@rneui/base';
import React, { useEffect, useState } from 'react'
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { primary, styles } from '../styles/style';
import { Input } from '@rneui/themed';


// Import services
import { getLevantamiento, postLevantamiento } from '../services/levantamientoServices'
import { getMarcadores } from '../services/marcadorServices'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { compareAsc, format } from 'date-fns';
import { getUbicacionActual } from '../utils/functions';

export const MarcadorModalComponent = ({ open, setOpen, getUbicacion }) => {
    const [levantamiento, setLevantamiento] = useState("c338-b3cb-05d2")
    // const [levantamiento, setLevantamiento] = useState("1e57-ea66-dabb")
    const [levantamientoErrors, setLevantamientoErrors] = useState("")
    const [cargando, setCargando] = useState(false)
    const [marcadores, setMarcadores] = useState([])
    const [levantamientoActivo, setLevantamientoActivo] = useState(false)
    const [selected, setSelected] = useState()
    const [descripcion, setDescripcion] = useState()
    const [enviar, setEnviar] = useState(true)

    const getMarcadoresView = async () => {
        const response = await getMarcadores()
        if (response.length > 0) {
            setMarcadores(response);
        }
    }

    useEffect(() => {
        if (selected) {
            setEnviar(false)
        }
    }, [selected])


    const unirseLevantamiento = async () => {
        setCargando(true)
        await AsyncStorage.removeItem('levantamiento')
        const { data, status } = await getLevantamiento(levantamiento)
        if (status === 200) {
            await AsyncStorage.setItem('levantamiento', JSON.stringify(data))
            await getMarcadoresView()
            setCargando(false)
            setLevantamientoActivo(true)

        } else {
            setCargando(false)
        }
    }

    const enviarMarcador = async () => {
        const ubicacion = await getUbicacionActual()
        const levantamiento = await AsyncStorage.getItem('levantamiento')
        const { codigo } = JSON.parse(levantamiento);

        const datos = {
            codigo,
            id_marcador: selected.id,
            nombre: selected.nombre,
            latitud: ubicacion.coords.latitude,
            longitud: ubicacion.coords.longitude,
            altitud: ubicacion.coords.altitude,
            comentario: descripcion ? descripcion : '',
            fecha_reporte: format(new Date(), 'dd-MM-yyyy hh:mm:ss'),
        }
        await postLevantamiento(datos)
        setSelected()
        setDescripcion("")
        setEnviar(true)
    }

    const cerrarLevantamiento = async () => {
        await AsyncStorage.removeItem('levantamiento');
        setLevantamientoActivo(false)
    }

    const cerrarModal = async () => {
        setOpen(!open)
    }

    const renderItem = ({ item }) => {
        return (
            <View style={{
                justifyContent: 'center',
                margin: 10,
                alignItems: 'center',
            }}>
                <TouchableOpacity
                    onPress={() => setSelected(item)}
                    style={selected?.id === item.id ? styles.iconoSelected : styles.iconos}
                >
                    <Icon
                        name={item.icono}
                        type='material-community'
                        color={selected?.id === item.id ? primary : 'grey'}
                        reverseColor={primary}
                        solid
                        size={selected?.id === item.id ? 50 : 40}
                    />

                </TouchableOpacity>
                <Text adjustsFontSizeToFit style={styles.modalText}>
                    {item.nombre}
                </Text>
            </View>
        );
    };

    useEffect(() => {
        const vericarLevantimiento = async () => {
            const previo = await AsyncStorage.getItem('levantamiento')
            if (previo) {
                const { fecha_vencimiento } = JSON.parse(previo);
                const [day, month, year] = fecha_vencimiento.split('-');
                const fecha = new Date(year, month - 1, day);
                const valido = compareAsc(fecha, new Date())
                if (valido === 1) {
                    setLevantamientoActivo(true)
                    getMarcadoresView()
                } else {
                    setLevantamientoActivo(false)
                }

            }
        }
        vericarLevantimiento()
    }, [])


    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={open}
                onRequestClose={() => {
                    setOpen(!open);
                }}
            >
                <View style={stylesMarcador.modal}>
                    <View style={stylesMarcador.head}>
                        <View>
                            <Icon
                                name='backspace-outline'
                                type='material-community'
                                size={30}
                                onPress={cerrarModal}
                                suppressHighlighting={true}
                            />
                            <Text style={{ fontSize: 15 }}>
                                Volver
                            </Text>
                        </View>
                        {
                            levantamientoActivo &&

                            <View>
                                <Icon
                                    name='chain-broken'
                                    type='font-awesome'
                                    size={30}
                                    onPress={cerrarLevantamiento}
                                    suppressHighlighting={true}
                                />
                                <Text style={{ fontSize: 15 }}>
                                    Cerrar
                                    levantamiento
                                </Text>
                            </View>
                        }
                    </View>
                    <View style={stylesMarcador.body}>
                        {
                            levantamientoActivo ?
                                <>
                                    <View style={{ flex: 1, alignItems: 'center', width: '100%' }}>
                                        <Text style={styles.modalTextTitle}>
                                            Seleccione un marcador
                                        </Text>
                                        <FlatList
                                            data={marcadores}
                                            renderItem={renderItem}
                                            keyExtractor={item => item.id}
                                            numColumns='3'
                                        />
                                        <Text style={styles.modalTextSubtitle}>
                                            Agregar descripción (Opcional)
                                        </Text>
                                        <View style={{ flex: 0.4, width: '80%' }}>
                                            <TextInput
                                                multiline={true}
                                                numberOfLines={8}
                                                style={{ borderWidth: 2, borderColor: primary, borderRadius: 5 }}
                                                onChangeText={setDescripcion}
                                                value={descripcion}
                                            />
                                        </View>
                                    </View>
                                </>
                                :
                                <>

                                    <Text style={styles.subtitleText}>El código de levantamiento sera proporcionado por el usuario investigador</Text>
                                    <Input
                                        onChangeText={setLevantamiento}
                                        value={levantamiento}
                                        autoCapitalize='none'
                                        placeholder={levantamientoErrors ? levantamientoErrors : "Código de levantamiento"}
                                        inputMode="text"
                                        textAlign='center'
                                        style={{ ...styles.input, color: 'black' }}
                                        // onBlur={() => isEmail()}
                                        errorMessage={levantamientoErrors}
                                        leftIcon={levantamientoErrors ? <Icon name="information-outline" type='material-community' size={20} color='white' /> : ''}
                                        errorStyle={levantamientoErrors ? stylesRegistro.errorStyle : null}
                                        label="Código de levantamiento"
                                        labelStyle={{ color: 'grey' }}
                                        inputContainerStyle={setLevantamientoErrors ? styles.inputContainerError : styles.inputContainer}
                                        onFocus={() => { setLevantamientoErrors("") }}
                                    />
                                </>
                        }


                    </View>
                    <View style={stylesMarcador.footer}>
                        <Button
                            title={levantamientoActivo ? 'Enviar' : 'Unirse'}
                            onPress={levantamientoActivo ? enviarMarcador : unirseLevantamiento}
                            buttonStyle={styles.buttonPrimary}
                            disabledStyle={styles.buttonPrimaryDisabled}
                            loading={cargando}
                            disabled={levantamientoActivo ? enviar : false}
                            radius="lg"
                            containerStyle={styles.buttonContainer}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const stylesMarcador = StyleSheet.create({
    head: {
        flex: 0.1,
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 20,
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
        paddingHorizontal: '10%'
    },
    modal: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',

    },
});