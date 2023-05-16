import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { primary, styles } from '../styles/style'
import { Button, Icon, Input } from '@rneui/base'
import { ContadorContext } from '../context/levantamiento/ContadorContext'
import { getVehiculos } from '../services/vehiculos';
import { FlatList } from 'react-native-gesture-handler'

const Contador = ({ navigation }) => {

    const [levantamiento, setLevantamiento] = useState("90dd-3e07-2cad")
    const [levantamientoErrors, setLevantamientoErrors] = useState()
    const [cargando, setCargando] = useState(false)
    const [vehiculos, setVehiculos] = useState()

    const { guardar, verificar, activo, levantamiento: levantamientoActivo, restablecer } = useContext(ContadorContext)


    const unirseLevantamiento = async () => {
        setCargando(true)
        if (levantamiento) {

            const continuar = await guardar(levantamiento);
            if (continuar) {
                console.log("object");

            }
        } else {
            setLevantamientoErrors('Debe ingresar un código de levantamiento')
        }
        setCargando(false)
    }

    const obtenerVehiculos = async() => {
        const response = await getVehiculos()
        setVehiculos(response);
    }

    useEffect(() => {
        verificar()
        obtenerVehiculos()
    }, [])

    useEffect(() => {

        navigation.setOptions({
            headerRight: () => (
                <>
                    {
                        activo &&
                        <TouchableOpacity onPress={() => restablecer()} style={{ width: 80, alignItems: 'center', flexDirection: 'row' }}>
                            <Text style={styles.text}> Cerrar </Text>
                            <Icon
                                name='chain-broken'
                                type='font-awesome'
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
        <TouchableOpacity
            style={{ width: '100%', margin: 5, borderRadius: 5, height:50, backgroundColor: primary, justifyContent: 'center', alignItems: 'center' }}
            activeOpacity={0.4}
        >
                    <Text style={styles.text}>{data.nombre}</Text>
        </TouchableOpacity>
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
                            <View style={{width: '100%', borderRadius: 5, justifyContent: 'center', alignItems: 'center', }}>
                                <Text style={styles.textBlack}>Actualmente tiene un código activo de levantamiento</Text>
                                <View style={{ flexDirection:'row', backgroundColor: primary, justifyContent: 'center', alignItems: 'center', borderRadius: 5, padding: 5, width: '40%' }}>
                                    <Text style={styles.text}>Código:{levantamientoActivo.codigo}</Text>
                                </View>
                                <FlatList
                                    data={vehiculos}
                                    renderItem={({ item, index }) => <Item data={item} index={index} />}
                                    keyExtractor={item => item.id}
                                    style={{ width: '100%' }}
                                    ListEmptyComponent={<EmptyList />}
                                />

                            </View> :
                            <View style={{ height: '15%', width: '90%', backgroundColor: 'white', borderRadius: 5, justifyContent: 'center', alignItems: 'center', }}>
                                <Text>Contador</Text>
                                <Input
                                    onChangeText={setLevantamiento}
                                    value={levantamiento}
                                    autoCapitalize='none'
                                    placeholder={levantamientoErrors ? levantamientoErrors : "XXXX-XXXX-XXXX"}
                                    inputMode="text"
                                    textAlign='center'
                                    style={{ ...styles.input, color: 'black' }}
                                    // onBlur={() => isEmail()}
                                    errorMessage={levantamientoErrors}
                                    leftIcon={levantamientoErrors ? <Icon name="information-outline" type='material-community' size={20} color='white' /> : ''}
                                    errorStyle={levantamientoErrors ? styles.errorStyle : null}
                                    label="Código de levantamiento"
                                    labelStyle={{ color: 'grey' }}
                                    inputContainerStyle={setLevantamientoErrors ? styles.inputContainerError : styles.inputContainer}
                                    onFocus={() => { setLevantamientoErrors("") }}
                                />
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Button
                                        title={activo ? 'Restablecer' : 'Omitir'}
                                        type="clear"
                                        titleStyle={{ color: 'gray' }}
                                        onPress={() => { activo ? restablecer() : setOpen(!open) }}
                                    />
                                    <Button
                                        title='Continuar'
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

            </ImageBackground >
        </View >
    )
}

export default Contador
