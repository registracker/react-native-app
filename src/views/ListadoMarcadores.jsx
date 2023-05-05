import React, { useState, useCallback, useEffect } from 'react'
import { FlatList, View } from 'react-native'
import { Button, Icon, ListItem } from '@rneui/base'
import { useFocusEffect } from '@react-navigation/native';

import { styles } from '../styles/style';
import { deleteReporteMarcador, getReporteMarcadorDatabase } from '../database/TblReporteMarcador';
import { postLevantamiento } from '../services/levantamientoServices'
import { SearchBar } from '@rneui/themed';


export const ListadoMarcadores = () => {

    const [levantamientos, setLevantamientos] = useState([])
    const [refreshing, setRefreshing] = useState(false);
    const [cargando, setCargando] = useState(false)

    const [search, setSearch] = useState("");

    const updateSearch = (search) => {
        setSearch(search);
    };

    /**
     * Metodo para busqueda con codigo, fecha o nombre del marcador
     */
    const searchText = async() => {
        const regexCodigo = /^[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}$/;
        const regexFecha = /^\d{2}-\d{2}-\d{4}$/;

        let result = null;
        const reportes = await getReporteMarcadorDatabase()

        if(!search){
            items();
            return;  
        }

        if (regexCodigo.test(search)) {
            result = reportes.filter( element => element.codigo === search) 
        } else if (regexFecha.test(search)){
            result = reportes.filter( element => {
                const fecha = element.fecha_reporte.split(" ")[0];
                if(fecha === search) {
                    return element
                }
                return;
            }) 
        } else {
            result = reportes.filter(element => element.nombre_marcador.toLowerCase() === search.toLowerCase()) 
        }
        setLevantamientos(result)
    }

    const items = async () => {
        const levantamientos = await getReporteMarcadorDatabase()
        setLevantamientos(levantamientos)
    }

    const eliminarReporteMarcador = async (id, reset) => {
        try {
            await deleteReporteMarcador(id)
            items();
        } catch (error) {
        } finally {
            reset()
        }
    }

    const enviarReporteMarcador = async (item, reset) => {
        try {
            setCargando(true)
            await postLevantamiento(item, false)
            items();
        } catch (error) {
        } finally {
            reset()
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

    const ItemMarcador = ({ item }) => (
        <ListItem.Swipeable
            leftContent={(reset) => (
                <Button
                    title="Eliminar"
                    onPress={() => eliminarReporteMarcador(item.id, reset)}
                    icon={{ name: 'delete', color: 'white' }}
                    buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
                />
            )}

            rightContent={(reset) => (
                <>
                    {
                        item.enviado === 1 ?
                            <Button
                                // onPress={() => enviarReporteMarcador(item, reset)}
                                icon={{ name: 'information', color: 'white' }}
                                buttonStyle={{ minHeight: '100%', backgroundColor: 'gray' }}
                            />
                            :
                            <Button
                                title="Enviar"
                                onPress={() => enviarReporteMarcador(item, reset)}
                                icon={{ name: 'send', color: 'white' }}
                                buttonStyle={{ minHeight: '100%', backgroundColor: 'green' }}
                                loading={cargando}
                            />
                    }
                </>
            )
            }
            containerStyle={{ backgroundColor: "white" }}
            topDivider={true}
        >
            <Icon name={item.icono} type='material-community' />
            <ListItem.Content  >
                <ListItem.Title>Registrado: {item.fecha_reporte}</ListItem.Title>
                <ListItem.Subtitle>Código:{item.codigo}</ListItem.Subtitle>
                <ListItem.Subtitle>{item.nombre_marcador}</ListItem.Subtitle>
            </ListItem.Content>

            <Icon
                type="material-community"
                name={item.enviado === 1 ? 'check-circle-outline' : 'cloud-upload'}
                color={item.enviado === 1 ? 'green' : 'grey'}
            />
        </ListItem.Swipeable >
    )


    const onRefresh = useCallback(() => {
        setRefreshing(true);
        items();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    return (
        <View style={styles.container}>
            <SearchBar
                placeholder="Buscar por codigo, fecha o marcardor..."
                onChangeText={updateSearch}
                value={search}
                lightTheme
                onBlur={searchText}
                onClear={items}
                // onKeyboardHide={searchText}
                autoCapitalize='none'
            />
            <FlatList
                data={levantamientos}
                refreshing={refreshing}
                onRefresh={onRefresh}
                renderItem={ItemMarcador}
            />
        </View>
    )
}
