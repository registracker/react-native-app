import React, { useState, useCallback, useEffect, useContext } from 'react'
import { FlatList, ImageBackground, ToastAndroid, View } from 'react-native'
import { Button, Icon, ListItem } from '@rneui/base'
import { useFocusEffect } from '@react-navigation/native';

import { Loading } from '../components/Loading'
import { styles } from '../styles/style';
import { deleteReporteIncidente, enviarIncidente, enviarIncidenteDatabase, getReporteIncidentesDatabase } from '../database/TblIncidentes';
import { postIncidente } from '../services/incidenteServices'
import { SearchBar } from '@rneui/themed';
import { format } from 'date-fns';
import { NetworkContext } from '../context/network/NetworkContext';
import { showToast } from '../utils/toast';

export const ListadoIncidentes = () => {

    const [listadoIncidentes, setListadoIncidentes] = useState()
    const [cargando, setCargando] = useState(false)
    const [refreshing, setRefreshing] = useState(false);

    const [search, setSearch] = useState("");

    const { isConnected } = useContext(NetworkContext)


    const updateSearch = (search) => {
        setSearch(search);
    };

    const searchText = async () => {
        const regexFecha = /^\d{2}-\d{2}-\d{4}$/;
        const incidentes = await getReporteIncidentesDatabase()

        let result = null;
        if (!search) {
            items();
            return;
        }

        if (regexFecha.test(search)) {
            result = incidentes.filter(element => {
                const fecha = element.fecha_reporte.split(" ")[0];
                if (fecha === search) {
                    return element
                }
                return;
            })
        } else {
            result = incidentes.filter(element => element.nombre.toLowerCase() === search.toLowerCase())
        }
        setListadoIncidentes(result)
    }



    const items = async () => {
        const incidentes = await getReporteIncidentesDatabase()
        setListadoIncidentes(incidentes)
    }

    const deleteIncidentes = async (id, reset) => {
        try {
            await deleteReporteIncidente(id)
            items();
            reset()
            showToast('Reporte de incidente eliminado exitosamente')

        } catch (error) {
            reset()
        }
    }


    const enviarReporteIncidente = async (item, reset) => {

        try {
            setCargando(true)
            await postIncidente(item)
            await enviarIncidenteDatabase(item.id)
            items();
            reset()
            showToast('Reporte de incidente enviado exitosamente')
        } catch (error) {
            reset()
        } finally {
            setCargando(false)
        }
    }

    useFocusEffect(
        useCallback(() => {
            items();
        }, [])
    );

    useEffect(() => {
        items();
    }, [])


    const onRefresh = useCallback(() => {
        setRefreshing(true);
        items();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);


    const itemIncidente = ({ item }) => (
        <ListItem.Swipeable
            leftContent={(reset) => (
                <Button
                    title="Eliminar"
                    onPress={() => deleteIncidentes(item.id, reset)}
                    icon={{ name: 'delete', color: 'white' }}
                    buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
                />
            )}
            rightContent={(reset) => (

                <>
                    {
                        isConnected ?
                            item.enviado === 1 ?
                                <Button
                                    onPress={() => reset()}
                                    icon={{ name: 'send-check', type: 'material-community', color: 'white' }}
                                    loading={cargando}
                                    buttonStyle={{ minHeight: '100%', backgroundColor: 'green' }}
                                /> :
                                <Button
                                    title="Enviar"
                                    onPress={() => enviarReporteIncidente(item, reset)}
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
            <Icon name={item.icono} type='material-community' />
            <ListItem.Content  >
                <ListItem.Title>{item.nombre}</ListItem.Title>
                <ListItem.Subtitle>{item.fecha_reporte}{item.enviado}</ListItem.Subtitle>
            </ListItem.Content>

            <Icon
                type="material-community"
                name={item.enviado == 1 ? 'check-circle-outline' : 'cloud-upload'}
                color={item.enviado == 1 ? 'green' : 'grey'}
            />
        </ListItem.Swipeable>
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

                <SearchBar
                    placeholder="Buscar por fecha o incidente..."
                    onChangeText={updateSearch}
                    value={search}
                    lightTheme
                    onBlur={searchText}
                    onClear={items}
                    // onKeyboardHide={searchText}
                    autoCapitalize='none'
                />
                <FlatList
                    data={listadoIncidentes}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    renderItem={itemIncidente}
                />
            </ImageBackground>
        </View>
    )
}
