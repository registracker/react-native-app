import React, { useState, useCallback, useEffect } from 'react'
import { FlatList, Text, ToastAndroid, View, VirtualizedList } from 'react-native'
import { Button, Icon, ListItem, Tab, TabView } from '@rneui/base'
import { useFocusEffect } from '@react-navigation/native';

import { styles } from '../styles/style';
import { deleteReporteMarcador, getReporteMarcadorDatabase } from '../database/TblReporteMarcador';
import { postLevantamiento } from '../services/levantamientoServices'


export const ListadoMarcadores = () => {

    const [levantamientos, setLevantamientos] = useState([])
    const [refreshing, setRefreshing] = useState(false);
    const [cargando, setCargando] = useState(false)



    const items = async () => {
        const levantamientos = await getReporteMarcadorDatabase()
        setLevantamientos(levantamientos)
    }

    const eliminarReporteMarcador = async (id, reset) => {
        try {
            await deleteReporteMarcador(id)
            items();
        } catch (error) {
            console.log("🚀 ~ file: ListadoMarcadores.jsx:29 ~ eliminarReporteMarcador ~ error:", error)
        } finally {
            reset()

        }
    }

    const enviarReporteMarcador = async (item, reset) => {
        try {
            setCargando(true)
            await postLevantamiento(item)
            items();
        } catch (error) {
            console.log("🚀 ~ file: ListadoMarcadores.jsx:42 ~ enviarReporteMarcador ~ error:", error)
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
                <Button
                    title="Enviar"
                    onPress={() => enviarReporteMarcador(item, reset)}
                    icon={{ name: 'send', color: 'white' }}
                    buttonStyle={{ minHeight: '100%', backgroundColor: 'green' }}
                    loading={cargando}
                />
            )}
            containerStyle={{ backgroundColor: "white" }}
            topDivider={true}
        >
            <Icon name={item.icono} type='material-community' />
            <ListItem.Content  >
                <ListItem.Title>Registrado: {item.fecha_reporte}</ListItem.Title>
                <ListItem.Subtitle>{item.nombre_marcador}</ListItem.Subtitle>
            </ListItem.Content>

            <Icon
                type="material-community"
                name={item.enviado === 1 ? 'check-circle-outline' : 'cloud-upload'}
                color={item.enviado === 1 ? 'green' : 'grey'}
            />
        </ListItem.Swipeable>
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
            <FlatList
                data={levantamientos}
                refreshing={refreshing}
                onRefresh={onRefresh}
                renderItem={ItemMarcador}
            />

        </View>
    )
}
