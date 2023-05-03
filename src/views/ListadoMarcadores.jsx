import React, { useState, useCallback, useEffect } from 'react'
import { FlatList, Text, ToastAndroid, View, VirtualizedList } from 'react-native'
import { Button, Icon, ListItem, Tab, TabView } from '@rneui/base'
import { useFocusEffect } from '@react-navigation/native';

import { getDesplazamientos, removeDesplazamiento, sendDesplazamiento } from '../database/TblDesplazamientos'
import { postDesplazamiento } from '../services/desplazamientoServices'
import { Loading } from '../components/Loading'
import { styles } from '../styles/style';
import { deleteReporteIncidente, enviarIncidente, getReporteIncidentesDatabase } from '../database/TblIncidentes';
import { postIncidente } from '../services/incidenteServices'
import { getLevantamiento, getReporteMarcadorDatabase } from '../database/TblReporteMarcador';

export const ListadoMarcadores = () => {

    const [levantamientos, setLevantamientos] = useState([])
    const [refreshing, setRefreshing] = useState(false);
    const [cargando, setCargando] = useState(false)



    const items = async () => {
        const levantamientos = await getReporteMarcadorDatabase()
        setLevantamientos(levantamientos)
    }


    useFocusEffect(
        useCallback(() => {
            items();
        }, [])
    );

    useEffect(() => {
        items();
    }, [])

    const ItemDesplazamiento = ({ item }) => (
        <ListItem.Swipeable
            leftContent={(reset) => (
                <Button
                    title="Eliminar"
                    onPress={() => deleteDesplazamiento(item.uuid, reset)}
                    icon={{ name: 'delete', color: 'white' }}
                    buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
                />
            )}
            rightContent={(reset) => (
                <Button
                    title="Enviar"
                    onPress={() => enviarDesplazamiento(item, reset)}
                    icon={{ name: 'send', color: 'white' }}
                    buttonStyle={{ minHeight: '100%', backgroundColor: 'green' }}
                    loading={cargando}
                />
            )}
            containerStyle={{ backgroundColor: "white" }}
            topDivider={true}
        >
            <Icon name="run" type='material-community' />
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
                renderItem={ItemDesplazamiento}
            />

        </View>
    )
}
