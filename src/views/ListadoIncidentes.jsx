import React, { useState, useCallback, useEffect } from 'react'
import { FlatList, ToastAndroid, View } from 'react-native'
import { Button, Icon, ListItem  } from '@rneui/base'
import { useFocusEffect } from '@react-navigation/native';

import { Loading } from '../components/Loading'
import { styles } from '../styles/style';
import { deleteReporteIncidente, enviarIncidente, getReporteIncidentesDatabase } from '../database/TblIncidentes';
import { postIncidente } from '../services/incidenteServices'

export const ListadoIncidentes = () => {

    const [listadoIncidentes, setListadoIncidentes] = useState()
    const [cargando, setCargando] = useState(false)
    const [refreshing, setRefreshing] = useState(false);


    const items = async () => {
        const incidentes = await getReporteIncidentesDatabase()
        setListadoIncidentes(incidentes)
    }

    const mostrarNotificacion = (mensaje) => {
        ToastAndroid.showWithGravity(
            mensaje,
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
        );
    };

    const deleteIncidentes = async (id, reset) => {
        const mensaje = 'Incidente eliminado. ';
        try {
            await deleteReporteIncidente(id)
            items();
            reset()
            mostrarNotificacion(mensaje)

        } catch (error) {
            reset()
        }
    }


    const enviarReporteIncidente = async (item, reset) => {
        const mensaje = 'Incidente enviado exitosamente.';

        try {
            setCargando(true)
            await postIncidente(item)
            await enviarIncidente(item.id)
            items();
            reset()
            mostrarNotificacion(mensaje)
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


    if (!listadoIncidentes) return <Loading />

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
                <Button
                    title="Enviar"
                    onPress={() => enviarReporteIncidente(item, reset)}
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
            <FlatList
                data={listadoIncidentes}
                refreshing={refreshing}
                onRefresh={onRefresh}
                renderItem={itemIncidente}
            /> 
        </View>
    )
}
