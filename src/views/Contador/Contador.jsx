import {
  ActivityIndicator,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {primary, styles} from '../../styles/style';
import {Badge, Button, FAB, Icon, Input} from '@rneui/base';
import {ContadorContext} from '../../context/levantamiento/ContadorContext';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import {CatalogosContext} from '../../context/store/CatalogosContext';
import {isAfter, isEqual} from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {NetworkContext} from '../../context/network/NetworkContext';
import {showToast} from '../../utils/toast';
import {truncateText} from '../../utils/functions';

const Contador = ({navigation}) => {
  const [cantidad, setCantidad] = useState(0);

  const {isConnected} = useContext(NetworkContext);
  const {
    listado,
    guardar,
    activo,
    levantamiento: levantamientoActivo,
    restablecer,
    enviar,
    conectarse,
    agregarRegistro,
    contador,
    actualizarConteo,
  } = useContext(ContadorContext);

  const [vehiculos, setVehiculos] = useState([]);
  const [contadorVehicular, setContadorVehicular] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const borrarVehiculo = id => {
    const ct = [...contador];
    const reversedArray = ct.slice().reverse();
    const index = reversedArray.findIndex(item => item.id_vehiculo === id);
    if (index !== -1) {
      const originalIndex = ct.length - 1 - index;
      ct.splice(originalIndex, 1);
      actualizarConteo(ct);
    }
  };

  const cerrarConteo = async () => {
    await restablecer();
    setModalVisible(!modalVisible);
    showToast('Conteo vehicular finalizado');
    restablecerContador();
  };

  const verificar = async () => {
    setLoading(true);
    const previo = await AsyncStorage.getItem('levantamiento-contador');
    if (previo) {
      const fechaActual = new Date();
      const levantamiento = JSON.parse(previo);
      const {periodo_fin} = levantamiento;
      const [year, month, day] = periodo_fin?.split('-');
      const fecha = new Date(year, month - 1, day);
      if (isAfter(fecha, fechaActual) || isEqual(fecha, fechaActual)) {
        if (isConnected) {
          await guardar(levantamiento.codigo);
        } else {
          await conectarse();
        }
      } else {
        showToast('Código de levantamiento no vigente');
        await restablecer();
      }
    } else {
      await restablecer();
    }
    setLoading(false);
  };

  const sumar = index => {
    const contador = [...vehiculos];
    contador[index].contador = contador[index].contador + 1;
    setContadorVehicular(contador);
    agregarRegistro(contador[index].id);
  };

  const restar = index => {
    const contador = [...vehiculos];
    if (contador[index].contador > 0) {
      contador[index].contador = contador[index].contador - 1;
      setContadorVehicular(contador);
      borrarVehiculo(vehiculos[index].id);
    }
  };

  const guardarRegistros = async () => {
    if (contadorVehicular.length > 0) {
      await enviar(contadorVehicular);
    }
  };

  const restablecerContador = () => {
    listado.forEach(element => {
      element.contador = 0;
    });
    setVehiculos(listado);
    setModalVisible(false);
    showToast('Contador vehicular restablecido');
  };

  useEffect(() => {
    verificar();
  }, []);

  useEffect(() => {
    if (listado?.length > 3) {
      navigation.navigate('ListadoVehiculo');
    } else {
      setVehiculos(listado);
    }
  }, [listado]);

  useEffect(() => {
    setContadorVehicular(contador);
  }, [contador]);

  useEffect(() => {
    setCantidad(contadorVehicular.length);
  }, [contadorVehicular]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          {activo && (
            <TouchableOpacity
              onPress={() => {
                setModalVisible(true);
              }}
              style={{
                width: 100,
                flexDirection: 'row-reverse',
                marginRight: 0,
              }}>
              <Icon
                name="cog-outline"
                type="material-community"
                color="white"
                suppressHighlighting={true}
              />
              <Text style={styles.text}>Ajustes</Text>
            </TouchableOpacity>
          )}
        </>
      ),
      headerLeft: () => (
        <Icon
          onPress={() => {
            navigation.navigate('TabNavegacion');
          }}
          type="ionicons"
          color="white"
          name="arrow-back"
          style={{marginRight: 5}}
        />
      ),
    });
  }, [activo]);

  const Item = ({data, index}) => (
    <View
      style={{
        width: '100%',
        marginBottom: 20,
        backgroundColor: 'white',
        borderRadius: 15,
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: primary,
        height: 150,
      }}>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          padding: 5,
          height: 80,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={{
            width: '35%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => restar(index)}
          activeOpacity={0}>
          <Icon type="material-community" name="minus-thick" color={primary} size={40} />
        </TouchableOpacity>
        <View
          style={{
            width: '30%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={styles.textBlack}>{data.nombre}</Text>
          <Text style={[styles.textBlack, {fontWeight: 'bold'}]}>
            {data.contador}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            width: '35%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => sumar(index)}
          delayPressIn={0}
          activeOpacity={0}>
          <Icon type="ionicons" name="add" color={primary} size={40}  />
        </TouchableOpacity>
      </View>
    </View>
  );

  const EmptyList = () => (
    <Text color="black" style={styles.textBlack}>
      NO HAY DATOS
    </Text>
  );

  const FlatListVehiculos = useCallback(() => {
    return (
      <FlatList
        data={vehiculos}
        renderItem={({item, index}) => <Item data={item} index={index} />}
        keyExtractor={item => item.id}
        style={{width: '100%'}}
        ListEmptyComponent={<EmptyList />}
      />
    );
  }, [vehiculos]);


  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../img/fondo.png')}
        resizeMode="cover"
        style={{
          flex: 1,
          justifyContent: 'center',
          tintColor: 'transparent',
        }}>
        <View
          style={[
            styles.item,
            {justifyContent: 'flex-start', padding: 8, height: 120, margin:10, marginTop:10},
          ]}
          activeOpacity={0.4}>
          <View style={{width: '10%'}}>
            <Icon name="car-3-plus" type="material-community" />
          </View>
          <View style={{alignItems: 'flex-start', width: '60%'}}>
            <Text style={[styles.textBlack, {textAlign: 'left'}]}>
              {truncateText(levantamientoActivo?.nombre_via, 50)}
            </Text>
            <Text style={[styles.textBlack, {textAlign: 'left', fontSize: 16}]}>
              Identificación: {levantamientoActivo?.identificacion_via}
            </Text>
            <Text style={[styles.textBlack, {textAlign: 'left', fontSize: 16}]}>
              Categoría: {levantamientoActivo?.categoria_via}
            </Text>
          </View>
          <View style={{width: '30%'}}>
            <Text
              style={[styles.textBlack, {textAlign: 'right', fontSize: 14}]}>
              Finaliza: {levantamientoActivo?.periodo_fin}
            </Text>
            <Text
              style={[styles.textBlack, {textAlign: 'right', fontSize: 14}]}>
              Código: {levantamientoActivo?.codigo}
            </Text>
          </View>
        </View>
        <View style={styles.body}>
          <View
            style={{
              width: '100%',
              borderRadius: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <FlatListVehiculos />
          </View>
          {activo && (
            <FAB
              icon={{
                name: 'content-save',
                color: 'white',
                type: 'material-community',
              }}
              size="large"
              disabled={cantidad === 0 ? true : false}
              placement="right"
              upperCase
              onPress={guardarRegistros}
              color={primary}
              title="Guardar"></FAB>
          )}
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setCantidad();
            setMensajeError();
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.titleBlack}>Ajustes</Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(!modalVisible);
                  navigation.navigate('ListadoVehiculo');
                }}
                style={{
                  width: '100%',
                  height: 35,
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  flexDirection: 'row',
                }}>
                <Icon name="car-select" type="material-community" />
                <Text style={styles.textBlack}>
                  Configurar Catálogos de vehiculos
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={restablecerContador}
                style={{
                  width: '100%',
                  height: 35,
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  flexDirection: 'row',
                }}>
                <Icon name="cog-counterclockwise" type="material-community" />

                <Text style={styles.textBlack}>Restablecer contador</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={cerrarConteo}
                style={{
                  width: '100%',
                  height: 35,
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  flexDirection: 'row',
                }}>
                <Icon name="car-arrow-left" type="material-community" />

                <Text style={styles.textBlack}>Cerrar conteo vehicular</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(!modalVisible)}
                style={{
                  width: '100%',
                  height: 35,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{color: primary, size: 18}}>Cerrar ajustes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </View>
  );
};

export default Contador;
