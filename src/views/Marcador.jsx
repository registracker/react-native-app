import {ImageBackground, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {FlatList, TextInput} from 'react-native-gesture-handler';
import {Button, Icon} from '@rneui/base';
import {useState} from 'react';
import {useEffect} from 'react';
import {styles, primary} from '../styles/style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {postReporteMarcador} from '../services/marcadorServices';
import {format} from 'date-fns';
import {useContext} from 'react';
import {MarcadorContext} from '../context/levantamiento/MarcadorContext';
import {CatalogosContext} from '../context/store/CatalogosContext';
import {showToast} from '../utils/toast';
import Geolocation from 'react-native-geolocation-service';
import { NetworkContext } from '../context/network/NetworkContext';
import { storeReporteMarcador } from '../database/TblReporteMarcador';

const Marcador = ({navigation}) => {
  const [cargando, setCargando] = useState(false);
  const [marcadores, setMarcadores] = useState([]);
  const [selected, setSelected] = useState();
  const [descripcion, setDescripcion] = useState();
  const [enviar, setEnviar] = useState(true);
  const {levantamiento, restablecer} = useContext(MarcadorContext);

  const {clt_marcadores} = useContext(CatalogosContext);

  const {isConnected} = useContext(NetworkContext)

  useEffect(() => {
    if (selected) {
      setEnviar(false);
    }
  }, [selected]);

  const enviarMarcador = async () => {
    setCargando(true);

    await Geolocation.getCurrentPosition(
      async ubicacion => {
        const levantamiento = await AsyncStorage.getItem('levantamiento');
        const {codigo} = JSON.parse(levantamiento);
        const datos = {
          codigo,
          id_marcador: selected.id,
          nombre: selected.nombre,
          icono: selected.icono,
          latitud: ubicacion.coords.latitude,
          longitud: ubicacion.coords.longitude,
          altitud: ubicacion.coords.altitude,
          comentario: descripcion ? descripcion : '',
          fecha_reporte: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
          enviado: 0,
        };
        if(isConnected) {
          await postReporteMarcador(datos);
        }else {
          await storeReporteMarcador(datos);
          showToast('Marcador registrado temporalmente en el dispositivo');
        }
      },
      error => {
        showToast('Activa la ubicación del dispositivo');
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );

    setSelected();
    setDescripcion('');
    setEnviar(true);
    setCargando(false);
  };

  const renderItem = ({item}) => {
    return (
      <View
        style={{
          justifyContent: 'flex-start',
          margin: 10,
          alignItems: 'center',
          width: 150,
          minHeight: 100,
        }}>
        <TouchableOpacity
          onPress={() => setSelected(item)}
          style={
            selected?.id === item.id ? styles.iconoSelected : styles.iconos
          }>
          <Icon
            name={item.icono}
            type="material-community"
            color={selected?.id === item.id ? primary : 'grey'}
            reverseColor={primary}
            solid
            size={selected?.id === item.id ? 50 : 40}
          />
        </TouchableOpacity>
        <Text adjustsFontSizeToFit style={styles.text}>
          {item.nombre}
        </Text>
      </View>
    );
  };

  const cerrarLevantamiento = async () => {
    setSelected();
    await AsyncStorage.removeItem('levantamiento');
    restablecer();
    showToast('Levantamiento cerrado');
    navigation.navigate('MisMarcadores');
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={cerrarLevantamiento}
          style={{
            width: 80,
            alignItems: 'center',
            flexDirection: 'row',
            marginRight: 10,
          }}>
          <Text style={styles.text}> Finalizar </Text>
          <Icon
            name="chain-broken"
            type="font-awesome"
            color="white"
            onPress={cerrarLevantamiento}
            suppressHighlighting={true}
          />
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <Icon
          onPress={() => {
            navigation.navigate('TabNavegacion');
          }}
          type="ionicons"
          color="white"
          name="arrow-back"
          size={30}
          style={{marginRight: 5}}
        />
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../img/fondo.png')}
        resizeMode="cover"
        style={{
          flex: 1,
          justifyContent: 'center',
          tintColor: 'transparent',
        }}>
        <View style={styles.body}>
          <View
            style={[
              styles.item,
              {
                justifyContent: 'flex-start',
                padding: 8,
                height: 80,
              },
            ]}
            activeOpacity={0.4}
            >
            <View style={{width: '10%'}}>
              <Icon name="traffic-light" type="material-community" />
            </View>
            <View style={{alignItems: 'flex-start', width: '60%'}}>
              <Text style={[styles.textBlack, {textAlign: 'left'}]}>
                Código: {levantamiento?.codigo}
              </Text>
              <Text
                style={[styles.textBlack, {textAlign: 'left', fontSize: 14}]}>
                Creado:{' '}
                {format(
                  new Date(levantamiento?.fecha_creado),
                  'yyyy-MM-dd hh:mm:ss aaaa',
                )}
              </Text>
            </View>
            <View style={{width: '30%'}}>
              <Text
                style={[styles.textBlack, {textAlign: 'right', fontSize: 14}]}>
                Finaliza: {levantamiento.fecha_vencimiento}
              </Text>
            </View>
          </View>
          <Text style={styles.title}>Seleccione un marcador</Text>
          <FlatList
            data={clt_marcadores.data}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            numColumns="2"
          />
          <Text style={styles.text}>Agregar una descripción (opcional)</Text>
          <TextInput
            multiline={true}
            numberOfLines={6}
            style={{
              borderWidth: 2,
              borderRadius: 15,
              width: '90%',
              backgroundColor: 'white',
              borderColor: primary,
              color: 'black',
            }}
            onChangeText={setDescripcion}
            value={descripcion}
          />
          <Button
            title={'Enviar'}
            onPress={enviarMarcador}
            buttonStyle={styles.buttonPrimary}
            disabledStyle={styles.buttonPrimaryDisabled}
            loading={cargando}
            disabled={enviar}
            radius="lg"
            containerStyle={styles.buttonContainer}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

export default Marcador;
