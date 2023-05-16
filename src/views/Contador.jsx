import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { primary, styles } from '../styles/style'
import { Button, Icon, Input } from '@rneui/base'
import { ContadorContext } from '../context/levantamiento/ContadorContext'
import { FlatList, ScrollView } from 'react-native-gesture-handler'

const Contador = ({ navigation }) => {

    const [levantamiento, setLevantamiento] = useState("90dd-3e07-8888")
    const [levantamientoErrors, setLevantamientoErrors] = useState()
    const [cargando, setCargando] = useState(false)
    const [vehiculos, setVehiculos] = useState()

    const { guardar, verificar, activo, levantamiento: levantamientoActivo, restablecer, sumar, listado, enviar } = useContext(ContadorContext)
    const agregarVehiculo = (vehiculo) => {
        // console.log(vehiculo);
        sumar(vehiculo)
    }

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

    const omitir = () => {
        console.log("object");
    }

    useEffect(() => {
        verificar()
    }, [])

    useEffect(() => {

        navigation.setOptions({
            headerRight: () => (
                <>
                    {
                        activo &&
                        <TouchableOpacity onPress={() => {enviar(); restablecer()}} style={{ width: 80, alignItems: 'center', flexDirection: 'row' }}>
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
            style={{ width: '100%', margin: 5, borderRadius: 5, height: 50, backgroundColor: primary, justifyContent: 'center', alignItems: 'center' }}
            activeOpacity={0.4}
            onPress={() => agregarVehiculo(index)}
        >
            <Text style={styles.text}>{data.nombre}</Text>
            <Text style={styles.text}>Contador: {data.contador}</Text>
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
                                <View style={{ width: '100%', borderRadius: 5, justifyContent: 'center', alignItems: 'center', }}>
                                    <Text style={styles.text}>Actualmente tiene un código activo de levantamiento</Text>
                                    <View style={{ flexDirection: 'row', backgroundColor: primary, justifyContent: 'center', alignItems: 'center', borderRadius: 5, padding: 5, width: '80%' }}>
                                        <Text style={styles.text}>Código:{levantamientoActivo.codigo}</Text>
                                    </View>
                                    <FlatList
                                        data={listado}
                                        renderItem={({ item, index }) => <Item data={item} index={index} />}
                                        keyExtractor={item => item.id}
                                        style={{ width: '100%' }}
                                        ListEmptyComponent={<EmptyList />}
                                    />

                                </View> :
                                <View style={{ width: '90%', backgroundColor: 'white', borderRadius: 5, justifyContent: 'center', alignItems: 'center', padding: 15 }}>
                                    <Text style={styles.textBlack}>Contador</Text>
                                    <Text style={styles.textBlack}>Código de levantamiento</Text>
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
                                        // label="Código de levantamiento"
                                        // labelStyle={{ color: 'grey' }}
                                        inputContainerStyle={setLevantamientoErrors ? styles.inputContainerError : styles.inputContainer}
                                        onFocus={() => { setLevantamientoErrors("") }}
                                    />
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        <Button
                                            title={activo ? 'Restablecer' : 'Omitir'}
                                            type="clear"
                                            titleStyle={{ color: 'gray' }}
                                            onPress={() => { activo ? restablecer() : omitir() }}
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
