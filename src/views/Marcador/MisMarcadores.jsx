import {View, Text, ImageBackground} from 'react-native';
import React, {useState} from 'react';
import {getMisMarcadores} from '../../services/marcadorServices';
import {useEffect} from 'react';
import {useContext} from 'react';
import {primary, styles} from '../../styles/style';
import {FlatList} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Button, Icon, Image} from '@rneui/base';
import {format} from 'date-fns';
import {ActivityIndicator} from 'react-native';
import {MarcadorContext} from '../../context/levantamiento/MarcadorContext';
import {NetworkContext} from '../../context/network/NetworkContext';

export const MisMarcadores = ({navigation}) => {
  const {getUltimoMarcador, guardar} = useContext(MarcadorContext);

  const [misContadores, setMisContadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [marcador, setMarcador] = useState();

  const {isConnected} = useContext(NetworkContext);

  const obtenerMarcadores = async () => {
    setLoading(true);
    const marcador = await getUltimoMarcador();
    const {data} = await getMisMarcadores();
    setMisContadores(data)
    if (marcador) {
      setMarcador(marcador);
      navigation.navigate('Marcador');
    }
    setLoading(false);
  };

  const actualizarMisMarcadores = async () => {
    setLoading(true);
    const {data} = await getMisMarcadores();
    setMisContadores(data);
    setLoading(false);
  };

  const unirseLevantamiento = async levantamiento => {
    setLoading(true);
    if (levantamiento) {
      const response = await guardar(levantamiento);
      if (response) {
        navigation.navigate('Marcador');
      }
    } else {
      setLevantamientoErrors('Debe ingresar un código de levantamiento');
    }
    setLoading(false);
  };

  useEffect(() => {
    obtenerMarcadores();
  }, []);

  const Item = ({data}) => (
    <TouchableOpacity
      style={[
        styles.item,
        {justifyContent: 'flex-start', padding: 8, height: 80},
      ]}
      activeOpacity={0.4}
      onPress={() => unirseLevantamiento(data.codigo)}>
      <View style={{width: '10%'}}>
        <Icon name="traffic-light" type="material-community" />
      </View>
      <View style={{alignItems: 'flex-start', width: '60%'}}>
        <Text style={[styles.textBlack, {textAlign: 'left'}]}>
          Código: {data.codigo}
        </Text>
        <Text style={[styles.textBlack, {textAlign: 'left', fontSize: 14}]}>
          Creado:{' '}
          {format(new Date(data.fecha_creado), 'yyyy-MM-dd hh:mm:ss aaaa')}
        </Text>
      </View>
      <View style={{width: '30%'}}>
        <Text style={[styles.textBlack, {textAlign: 'right', fontSize: 14}]}>
          Finaliza: {data.fecha_vencimiento}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../img/fondo.png')}
        resizeMode="cover"
        style={{
          flex: 1,
          justifyContent: 'center',
        }}>
        <View style={[styles.body, styles.center]}>
          {loading ? (
            <ActivityIndicator size="large" color={primary} />
          ) : misContadores.length > 0 ? (
            <FlatList
              data={misContadores}
              renderItem={({item, index}) => <Item data={item} index={index} />}
              keyExtractor={item => item.id}
              onRefresh={actualizarMisMarcadores}
              refreshing={loading}
            />
          ) : (
            <View>
              <View style={styles.center}>
                <Text style={styles.title}>
                  {isConnected
                    ? 'Sin datos o registros encontrados...'
                    : 'Sin conexion a internet'}
                </Text>
                <Image
                  style={[styles.image, {width: 200, height: 200}]}
                  source={
                    isConnected
                      ? require('../../img/empty.png')
                      : require('../../img/disconneted.png')
                  }
                  onPress={isConnected ? actualizarMisMarcadores : null}
                />
                {isConnected && (
                  <Button
                    title="Presiona para actualizar"
                    type="clear"
                    titleStyle={{color: 'white', fontWeight: ''}}
                    size="lg"
                    containerStyle={{
                      width: '100%',
                      marginHorizontal: 50,
                      marginVertical: 10,
                    }}
                    onPress={actualizarMisMarcadores}
                  />
                )}
                {marcador && (
                  <View style={{marginTop: 10}}>
                    <Text style={styles.title}>Registro guardado</Text>
                    <TouchableOpacity
                      style={[
                        styles.item,
                        {
                          justifyContent: 'flex-start',
                          padding: 8,
                          height: 80,
                        },
                      ]}
                      activeOpacity={0.4}
                      onPress={() => navigation.navigate('Marcador')}>
                      <View style={{width: '10%'}}>
                        <Icon name="traffic-light" type="material-community" />
                      </View>
                      <View style={{alignItems: 'flex-start', width: '60%'}}>
                        <Text style={[styles.textBlack, {textAlign: 'left'}]}>
                          Código: {marcador?.codigo}
                        </Text>
                        <Text
                          style={[
                            styles.textBlack,
                            {textAlign: 'left', fontSize: 14},
                          ]}>
                          Creado:{' '}
                          {format(
                            new Date(marcador.fecha_creado),
                            'yyyy-MM-dd hh:mm:ss aaaa',
                          )}
                        </Text>
                      </View>
                      <View style={{width: '30%'}}>
                        <Text
                          style={[
                            styles.textBlack,
                            {textAlign: 'right', fontSize: 14},
                          ]}>
                          Finaliza: {marcador.fecha_vencimiento}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      </ImageBackground>
    </View>
  );
};
