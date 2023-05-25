import { View, Text, ImageBackground, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import { deleteReporteContadorCodigoDatabase, getReporteContadorCodigoDatabase, getReporteContadorDatabase, updateReporteContadorDatabase } from '../database/TblReporteContador';
import { useState } from 'react';
import { styles } from '../styles/style';
import { Button, Icon, ListItem, SearchBar } from '@rneui/base';
import { useContext } from 'react';
import { NetworkContext } from '../context/network/NetworkContext';

import { enviarReporte } from '../services/vehiculos';
import { showToast } from '../utils/toast';


export default ListadoContador = () => {

    const [contador, setContador] = useState()
    const [search, setSearch] = useState("");
    const [cargando, setCargando] = useState(false)


    const {isConnected} = useContext(NetworkContext)

    const items = async () => {
        const data = await getReporteContadorDatabase()
        setContador(data)
    }

    const verificarDatos = async (codigo, reset) => {
        setCargando(true)
        const datos = await getReporteContadorCodigoDatabase(codigo)
        if (datos.length > 0) {
            const database = datos.map(item =>JSON.parse(item.contador))         
            const { status } = await enviarReporte(database);
            if(status === 200){
                await updateReporteContadorDatabase(codigo)
                await items()
                showToast('Datos de conteo vehicular sincronizados correctamente');            
            }
        }
        setCargando(false)
        reset()
    }

    const removeDatos = async(codigo, reset) => {
        await deleteReporteContadorCodigoDatabase(codigo)
        await items()
        showToast('Elemento eliminado');            
        reset()
    }


    const updateSearch = (search) => {
        setSearch(search);
    };

    const searchText = async () => {
        const regex = /^[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}$/;
        const data = await getReporteContadorDatabase()

        let result = null;
        if (regex.test(search)) {
            result = data.filter(element => element.codigo === search)
            setContador(result)
        } else {
            setContador(data)
        }
        setContador(result)
    }

    useEffect(() => {
        items()
    }, [])

    const itemContador = ({ item }) => (
        <ListItem.Swipeable
            leftContent={(reset) => (
                <Button
                    title="Eliminar"
                    onPress={() => removeDatos(item.codigo, reset)}
                    icon={{ name: 'delete', color: 'white' }}
                    buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
                />
            )}
            rightContent={(reset) => (
                <>
                    {
                        isConnected ?
                            <Button
                                title="Enviar"
                                onPress={() => verificarDatos(item.codigo, reset)}
                                icon={{ name: 'send', color: 'white' }}
                                buttonStyle={{ minHeight: '100%', backgroundColor: 'green' }}
                                loading={cargando}
                            />
                            : <Button
                                title="Desconectado"
                                onPress={() => reset()}
                                icon={{ name: 'access-point-network-off', type: 'material-community', color: 'white' }}
                                buttonStyle={{ minHeight: '100%', backgroundColor: 'gray' }}
                            />
                    }
                </>
            )}
            containerStyle={{ backgroundColor: "white" }}
            topDivider={true}
        >
            <Icon name="car" type='material-community' />
            <ListItem.Content  >
                <ListItem.Title>Levantamiento: {item.codigo}</ListItem.Title>
                <ListItem.Subtitle>Datos a sincronizar: {item.cantidad}</ListItem.Subtitle>
            </ListItem.Content>

            <Icon
                type="material-community"
                name={item.enviado === 1 ? 'check-circle-outline' : 'cloud-upload'}
                color={item.enviado === 1 ? 'green' : 'grey'}
            />
        </ListItem.Swipeable>
    )


    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../img/fondo.png')}
                resizeMode="cover"
                style={styles.imageBackground}
            >
                <SearchBar
                    placeholder="Buscar por identificador o fecha ..."
                    onChangeText={updateSearch}
                    value={search}
                    lightTheme
                    onBlur={searchText}
                    onClear={items}
                    // onKeyboardHide={searchText}
                    autoCapitalize='none'
                />
                <FlatList
                    data={contador}
                    renderItem={itemContador}
                />
            </ImageBackground>
        </View>
    )
}

