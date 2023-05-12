import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { primary, styles } from '../styles/style';
import { FlatList } from 'react-native-gesture-handler';
import { Button, Icon } from '@rneui/base';
import { Input } from '@rneui/themed';

import { postBuscarRutasTransporte } from '../services/rutasTransporteService'

const ListadoRutaTransporte = ({ navigation }) => {

    const [ruta, setRuta] = useState()
    const [rutaErrors, setRutaErrors] = useState()

    const [resultado, setResultado] = useState()
    const [links, setLinks] = useState()

    const buscar = async (paginate) => {
        const page = paginate ? paginate.split('?')[1] : null
        const { data, links } = await postBuscarRutasTransporte(ruta, page)
        setResultado(data)
        setLinks(links)
    }

    const Item = ({ data, index }) => (
        <View style={stylesCosto.item}>
            <View style={stylesCosto.elements}>
                <Icon name='bus' type='material-community' size={25} color="gray" />
                <View>
                    <Text style={stylesCosto.title}>Ruta:{data.ruta}</Text>
                    <Text style={stylesCosto.title}>{data.codigo_ruta}</Text>
                </View>
            </View>
            <View style={stylesCosto.elements}>
                <Text
                    style={stylesCosto.title}
                >$ {parseFloat(data.tarifa_autorizada, 10).toFixed(2)}</Text>
            </View>
        </View>
    );

    return (
        <View style={{
            flex: 1,
            justifyContent: 'space-around',
            alignContent: 'center',
            width: '100%',
        }}>

            <View style={styles.body}>
                <View style={{ justifyContent: 'center', marginHorizontal: 10, width: '100%' }}>

                    <Input
                        onChangeText={setRuta}
                        value={ruta}
                        autoCapitalize='none'
                        placeholder={rutaErrors ? rutaErrors : "Buscar por ruta, código o departamento"}
                        inputMode="text"
                        textAlign='center'
                        style={{ ...styles.input, color: 'black' }}
                        // onBlur={() => isEmail()}
                        errorMessage={rutaErrors}
                        leftIcon={rutaErrors ? <Icon name="information-outline" type='material-community' size={20} color='white' /> : ''}
                        errorStyle={rutaErrors ? stylesRegistro.errorStyle : null}
                        label="Código de levantamiento"
                        labelStyle={{ color: 'grey' }}
                        inputContainerStyle={setRutaErrors ? styles.inputContainerError : styles.inputContainer}
                        onFocus={() => { setRutaErrors("") }}
                    />

                    <FlatList
                        data={resultado}
                        renderItem={({ item, index }) => <Item data={item} index={index} />}
                        keyExtractor={item => item.id}
                    />
                    <View style={{flexDirection:'row', justifyContent: 'center', alignItems:'center', marginBottom: 10}}>

                        <Button
                            containerStyle={{ margin: 5 }}
                            // disabled={true}
                            disabledStyle={{
                                borderWidth: 2,
                                borderColor: "transparent",
                            }}
                            icon={<Icon name="arrow-left-thick" type='material-community' size={15} color="white" />}
                            iconContainerStyle={{ background: "#000" }}
                            loadingProps={{ animating: true }}
                            loadingStyle={{}}
                            onPress={() => buscar(links.prev)}
                            titleProps={{}}
                            color={primary}
                            disabled={ !links?.prev }
                        />
                        <Button
                            containerStyle={{ margin: 5 }}
                            disabledStyle={{
                                borderWidth: 2,
                                borderColor: "transparent",
                            }}
                            icon={<Icon name="arrow-right-thick" type='material-community' size={15} color="white" />}
                            iconContainerStyle={{ background: "#000" }}
                            loadingProps={{ animating: true }}
                            loadingStyle={{}}
                            onPress={() => buscar(links.next)}
                            titleProps={{}}
                            color={primary}
                            disabled={!links?.next}

                        />
                    </View>
                </View>
            </View>
            <View>
                <Button
                    title='Buscar...'
                    buttonStyle={styles.buttonPrimary}
                    onPress={() => buscar()}
                />
                <Button
                    title='Omitir'
                    buttonStyle={styles.buttonSecondary}
                    onPress={() => navigation.navigate('TabNavegacion')}
                />
            </View>
        </View>
    )
}

export default ListadoRutaTransporte


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