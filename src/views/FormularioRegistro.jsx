import React, { useEffect, useState, createRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import { primary, styles } from '../styles/style';
import { Button, CheckBox, Icon } from '@rneui/base';
import { Input } from '@rneui/themed';
import { getRoles, register } from '../services/aurtenticacionServices';
import { getTerminosCondiciones } from '../services/terminosCondicionesServices';

export const FormularioRegistro = ({ route, navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState();
  const [passwordErrorMessage, setPasswordErrorMessage] = useState();
  const [passwordConfirmErrorMessage, setPasswordConfirmErrorMessage] =
    useState();
  const [emailErrorMessage, setEmailErrorMessage] = useState();
  const [formInvalid, setFormInvalid] = useState(true);
  const [cargando, setCargando] = useState(false);
  const [rol, setRol] = useState();
  const [roles, setRoles] = useState([])
  const [selectionRol, setSelectionRol] = useState(false);

  const [checked, setChecked] = React.useState(false);
  const toggleCheckbox = () => setChecked(!checked);
  const [modalVisible, setModalVisible] = useState(false);

  const [loader, setLoader] = useState(true)
  
  const [loaderTerminos, setLoaderTerminos] = useState(true)
  const [terminos, setTerminos] = useState()

  const inputPassword = createRef();
  const inputPasswordConfirm = createRef();
  const inputEmail = createRef();

  const registrar = async () => {
    const datos = {
      email,
      password,
      rol: selectionRol,
    };

    try {
      setCargando(true);
      if (comparePassword()) {
        const { data } = await register(datos);
        const { estado_cuenta } = data
        if (estado_cuenta === 'En revisión') {
          ToastAndroid.showWithGravity(
            'Cuenta con estado de revisión',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
          );
        } else if (estado_cuenta === 'Activa') {
          ToastAndroid.showWithGravity(
            'Cuenta creada con exito',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
          );
        }
        navigation.navigate('Login');
      } else {
        inputPassword.current.focus();
        inputPassword.current.clear();
        inputPasswordConfirm.current.clear();
      }
    } catch (error) {

      ToastAndroid.showWithGravity(
        `${error.data.message}`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } finally {
      setCargando(false);
      cleanForm();
    }
  };

  const comparePassword = () => {
    if (password === passwordConfirm) {
      return true;
    } else {
      ToastAndroid.showWithGravity(
        'La contraseña no coinciden',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return false;
    }
  };

  const isEmail = () => {
    if (email) {
      const validRegex = /^[a-zA-Z0-9._]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (!email.match(validRegex)) {
        setEmailErrorMessage('Ingrese un correo electrónico valido');
        return false;
      } else {
        setEmailErrorMessage();
        return true;
      }
    }
  };


  /* 
    ^                         Start anchor
    (?=.*[A-Z])               Ensure string has one uppercase letters.
    (?=.*[!@#$&*])            Ensure string has one special case letter.
    (?=.*[0-9])               Ensure string has one digits.
    (?=.*[a-z].*[a-z].*[a-z]) Ensure string has three lowercase letters.
    .{8,}                      Ensure string is of length 8. Para cualquiera que quiera una longitud de al menos
    $                         End anchor.
    */
  const isPasswordSecure = () => {
    if (password) {

      const validRegex =
        /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/;
      if (!password.match(validRegex)) {
        setFormInvalid(true);
        setPasswordErrorMessage('La contraseña debe tener mínimo una letra mayúscula, tres minúscula, un carácter especial, un dígito y mínimo ocho caracteres');
      } else {
        setPasswordErrorMessage();
      }
    }
  };

  const cleanForm = () => {
    setPassword(null);
    setPasswordConfirm(null);
    setRol()
  };

  const matchPassword = () => {
    if (password !== passwordConfirm && passwordConfirm) {
      setPasswordErrorMessage('Las contraseña no coinciden');
      setPasswordConfirmErrorMessage('Las contraseña no coinciden');
      setFormInvalid(true);
    }
  }

  useEffect(() => {

    if (!email && password && passwordConfirm) {
      setEmailErrorMessage('Ingrese un correo electrónico');
      setFormInvalid(true);
    }
    if (
      password === passwordConfirm &&
      email &&
      passwordConfirm &&
      isEmail() &&
      selectionRol &&
      checked
    ) {
      setPasswordErrorMessage();
      setPasswordConfirmErrorMessage();
      setEmailErrorMessage();
      setFormInvalid(false);
    } else {
      setFormInvalid(true);
    }

  }, [passwordConfirm, password, email, selectionRol, checked]);


  useEffect(() => {
    const obtenerRoles = async () => {
      const roles = await getRoles();
      setRoles(roles);
      if (roles) setLoader(false);
    }
    const obtenerTerminosCondiciones = async () => {
      const data = await getTerminosCondiciones();
      setTerminos(data.descripcion);
      setLoaderTerminos(false);
    }
    obtenerRoles()
    obtenerTerminosCondiciones()
  }, [])

  const Item = ({ data }) => (
    <TouchableOpacity
      style={data.id == selectionRol ? styles.customButtom : styles.customButtomDisabled}
      onPress={() => setSelectionRol(data.id)}
    >
      <Icon
        name="account-hard-hat"
        type="material-community"
        size={36}
        color="white"
      />
      <Text style={styles.text}>
        {data.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      <ImageBackground
        source={require('../img/loginBackground.jpg')}
        resizeMode="cover"
        style={{
          flex: 1,
          justifyContent: 'center',
        }}>
        <ScrollView>
          <View style={styles.body}>

            <Text style={styles.title}>Registro de usuario</Text>
            <Text style={styles.text}>Elige un rol para tu usuario</Text>
            <View style={styles.row}>
              {
                !loader ?
                  <FlatList
                    data={roles}
                    renderItem={({ item }) => <Item data={item} />}
                    keyExtractor={item => item.id}
                    horizontal
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
                  />
                  :
                  <ActivityIndicator size={'large'} color={'white'} />
              }

            </View>

            <View style={styles.center} >
              <Input
                onChangeText={setEmail}
                value={email}
                autoCapitalize='none'
                label="Correo electrónico"
                placeholder="Correo electrónico"
                keyboardType="email-address"
                inputMode="email"
                textAlign="center"
                onFocus={() => { setEmailErrorMessage() }}
                style={styles.input}
                inputContainerStyle={emailErrorMessage ? styles.inputContainerError : styles.inputContainer}
                leftIcon={emailErrorMessage ? <Icon name="information-outline" type='material-community' size={20} color='white' /> : ''}
                ref={inputEmail}
                errorMessage={emailErrorMessage}
                onBlur={() => isEmail()}
                labelStyle={{ marginTop: 10, color: 'white' }}
                errorStyle={emailErrorMessage ? stylesRegistro.errorStyle : null}
              />
              <Input
                onChangeText={setPassword}
                onFocus={() => { setPasswordErrorMessage() }}

                value={password}
                style={styles.input}
                label="Contraseña"
                labelStyle={{ marginTop: 10, color: 'white' }}
                textAlign="center"
                placeholder="**********"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="newPassword"
                secureTextEntry
                enablesReturnKeyAutomatically
                inputContainerStyle={passwordErrorMessage ? styles.inputContainerError : styles.inputContainer}
                leftIcon={passwordErrorMessage ? <Icon name="information-outline" type='material-community' size={20} color='white' /> : ''}
                errorMessage={passwordErrorMessage}
                errorStyle={
                  passwordErrorMessage ? stylesRegistro.errorStyle : null
                }
                ref={inputPassword}
                onBlur={isPasswordSecure}
              />
              <Input
                onChangeText={setPasswordConfirm}
                onFocus={() => { setPasswordConfirmErrorMessage("") }}
                value={passwordConfirm}
                style={styles.input}
                label="Confirmar contraseña"
                labelStyle={{ marginTop: 10, color: 'white' }}
                textAlign="center"
                placeholder=" *********"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="newPassword"
                secureTextEntry
                enablesReturnKeyAutomatically
                inputContainerStyle={passwordConfirmErrorMessage ? styles.inputContainerError : styles.inputContainer}
                leftIcon={passwordConfirmErrorMessage ? <Icon name="information-outline" type='material-community' size={20} color='white' /> : ''}
                errorMessage={passwordConfirmErrorMessage}
                errorStyle={
                  passwordConfirmErrorMessage ? stylesRegistro.errorStyle : null
                }
                ref={inputPasswordConfirm}
                onBlur={matchPassword}
              />
              {/* TODO: Mostrar el texto de términos y condiciones */}
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <CheckBox
                  checked={checked}
                  onPress={() => setChecked(true)}
                  onIconPress={toggleCheckbox}
                  iconType="material-community"
                  checkedIcon="checkbox-marked"
                  uncheckedIcon={'checkbox-blank-outline'}
                  checkedColor='white'
                  // title="He leído, y acepto los términos y condiciones."
                  containerStyle={{
                    borderRadius: 3,
                    backgroundColor: 'transparent',
                  }}
                />
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'white',
                    fontSize: 14,
                    textDecorationLine: 'underline'
                  }}
                  onPress={() => setModalVisible(true)}
                >
                  He leído, acepto los
                  términos y condiciones
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.foobar}>
            <Button
              title="Registrarse"
              onPress={registrar}
              buttonStyle={styles.buttonPrimary}
              disabledStyle={styles.buttonPrimaryDisabled}
              loading={cargando}
              disabled={formInvalid}
              radius="lg"
              containerStyle={styles.buttonContainer}
            />
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <View style={{ ...styles.centeredView, backgroundColor: 'white' }}>
              <View style={{
                flex: 1
              }}>
                <View style={{
                  flex: 7
                }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', }}>Términos y Condiciones</Text>
                  <ScrollView >
                    {
                      loaderTerminos ?
                        <ActivityIndicator size={'large'} color={primary} />
                        :
                        <Text style={{
                          fontSize: 12,
                          textAlign: 'justify',
                          // textDecorationLine: 'line-through',
                          color: 'black',
                          textTransform:'uppercase'
                        }}>{terminos}.</Text>

                    }
                  </ScrollView>
                </View>
                <View style={{
                  flex: 0.5,
                  justifyContent: 'center',
                  alignContent: 'center',
                }}>
                  <Button title="Cerrar" type="clear" titleStyle={{ color: primary }} onPress={() => setModalVisible(!modalVisible)} />
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </ImageBackground>
    </View >

  );
};

const stylesRegistro = StyleSheet.create({
  errorStyle: {
    color: 'black',
    textAlign: 'center',
    backgroundColor: 'white',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 14,
  },

});
