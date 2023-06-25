import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import {useContext} from 'react';
import {CatalogosContext} from '../context/store/CatalogosContext';
import {useState} from 'react';
import {Button, CheckBox, Icon} from '@rneui/base';
import {primary, styles} from '../styles/style';
import {ContadorContext} from '../context/levantamiento/ContadorContext';
import {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showToast} from '../utils/toast';
import {FlatList} from 'react-native-gesture-handler';
import {CANT_VEHICULOS} from '@env';

export default ListadoVehiculo = ({navigation}) => {
  const {ctl_vehiculos} = useContext(CatalogosContext);
  const {actualizarListado, listado} = useContext(ContadorContext);
  const [continuar, setContinuar] = useState(true);

  const [selectedItems, setSelectedItems] = useState([]);
  const [cantidad] = useState(CANT_VEHICULOS || 3);

  const onSelectedItemsChange = item => {
    if (selectedItems.includes(item)) {
      const selecteds = selectedItems.filter(elemento => elemento !== item);
      setSelectedItems(selecteds);
      return;
    }

    if (selectedItems.length < cantidad) {
      setSelectedItems([...selectedItems, item]);
    } else {
      showToast('No se permiten mas de tres vehículos');
    }
  };

  const guardarVehiculos = async () => {
    if (selectedItems.length > 0) {
      await actualizarListado(selectedItems);
      navigation.navigate('Contador');
    } else {
      showToast('No ha seleccionado ningún vehículo');
    }
  };

  const backHome = async () => {
    await AsyncStorage.removeItem('levantamiento-contador');
    setSelectedItems([]);
    navigation.navigate('MisContadores');
  };

  useEffect(() => {
    const obtenerLista = async () => {
      const vehiculos = await AsyncStorage.getItem('listado-vehiculos');
      const lista = vehiculos != null ? JSON.parse(vehiculos) : null;
      if (lista) {
        setSelectedItems(lista);
      }
    };
    obtenerLista();
  }, []);

  useEffect(() => {
    if (selectedItems.length >= 1) {
      setContinuar(false);
    } else {
      setContinuar(true);
    }
  }, [selectedItems]);

  React.useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Icon
          onPress={() => {
            backHome();
          }}
          type="ionicons"
          color="white"
          name="arrow-back"
          style={{marginRight: 5}}
        />
      ),
    });
  }, [navigation]);

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity>
        <View>
          <CheckBox
            title={item.nombre}
            checkedColor={primary}
            checked={selectedItems.includes(item.id)}
            onPress={() => onSelectedItemsChange(item.id)}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{padding: 10, flex: 1}}>
        <FlatList
          data={ctl_vehiculos.data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
        <Button
          onPress={() => guardarVehiculos(selectedItems)}
          title={'Continuar'}
          disabled={continuar}
          buttonStyle={styles.buttonPrimary}
        />
      </View>
    </View>
  );
};
