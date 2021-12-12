import React, {useState, useRef, useEffect} from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, ImageBackground, ScrollView, Image, TouchableOpacity, PermissionsAndroid, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons} from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Header, Avatar, Badge, Tooltip, Input  } from'react-native-elements';
import * as SQLite from 'expo-sqlite';
import {Picker} from '@react-native-picker/picker';
import { Camera } from 'expo-camera';

const db = SQLite.openDatabase('coursedb.db');

function KotiSivu({ navigation }) {
  
  const [aika, setAika] = useState('');
  const [tehtava, setTehtava] = useState('');
  const [tapahtuma, setTapahtuma] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists course (id integer primary key not null, credits int, title text);');
    });
    updateList();    
  }, []);

  
  const saveItem = () => {
    db.transaction(tx => {
        tx.executeSql('insert into course (credits, title) values (?, ?);', [aika, tehtava]);    
      }, null, updateList
    )
  }
  
  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from course;', [], (_, { rows }) =>
        setTapahtuma(rows._array)
      ); 
    });
  }

  const deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from course where id = ?;`, [id]);
      }, null, updateList
    )    
  }

  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "100%",
          backgroundColor: "grey",
          
        }}
      />
    );
  };

  return (
    <SafeAreaProvider>
    
    <Header
    leftComponent={{ icon:'gps-fixed', color: '#fff' }}
    centerComponent={{ text:'MUISTUTUKSET', style:{ color: '#fff' } }}
    rightComponent={{ icon:'wifi', color: '#fff' }}
    backgroundColor= '#5f9ea0'
    />

<ScrollView style={styles.scrollView}>
      
      <TextInput placeholder='Tehtävä/asia' style={{marginTop: 30, fontSize: 25, width: 350, marginLeft: 10, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(tehtava) => setTehtava(tehtava)}
        value={tehtava}/>  

      <TextInput placeholder='Deadline (DD.MM.YYYY)' style={{ marginTop: 5, marginBottom: 5, marginLeft: 10,  fontSize:25, width: 350, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(aika) => setAika(aika)}
        value={aika}/>   

      <Button onPress={saveItem} title="Tallenna" color='green' /> 

      <Text style={{marginTop: 10, fontSize: 25}}>   Muistutukset:</Text>
      <Text> </Text>
      <FlatList 
        style={{marginLeft : "5%"}}
        keyExtractor={item => item.id.toString()} 
        renderItem={({item}) => <View style={styles.container3}><Text style={{fontSize: 18}}>{item.title}, {item.credits}</Text>
        <Text style={{fontSize: 18, color: 'orange'}} onPress={() => deleteItem(item.id)}> Poista</Text></View>} 
        data={tapahtuma} 
        ItemSeparatorComponent={listSeparator} 
      />

</ScrollView>

   
    </SafeAreaProvider>
  );
}

//KOTISIVU LOPPUU
//KOTISIVU LOPPUU

function BudjettiSivu({ navigation }) {
  
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists budjetti (id integer primary key not null, menoerä string, summa int, budjetti int, asumisMenot int );');
    });
    updateList();    
  }, []);

  const tallennaMeno = () => {
    db.transaction(tx => {
        tx.executeSql('insert into budjetti (menoerä, summa) values (?, ?);', [menoerä, summa]);    
      }, null, updateList
    )
  }

  const tallennaKuukausi = () => {
    db.transaction(tx => {
        tx.executeSql('insert into budjetti (budjetti, asumisMenot) values (?, ?);', [budjetti, asumisMenot]);    
      }, null, updateList
    )
  }
  
  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from budjetti;', [], (_, { rows }) =>
        setTapahtuma(rows._array)
      ); 
    });
  }

  const deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from budjetti where id = ?;`, [id]);
      }, null, updateList
    )    
  }

  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "100%",
          backgroundColor: "grey",
          
        }}
      />
    );
  };
  
  const [budjetti, setBudjetti] = React.useState('');
  const [asumisMenot, setAsumisMenot] = React.useState('');
  const [menoerä, setMenoerä] = useState('');
  const [summa, setSumma] = useState('');
  const [tapahtuma, setTapahtuma] = useState([]);

  const kaytettavissa = budjetti-asumisMenot-summa;

  return (

<SafeAreaProvider>

<ScrollView style={styles.scrollView}>
<View style={styles.container2}>
        <Text style = {styles.text2}>
          Kuukauden budjetti (€) :
        </Text>
      <TextInput
        style={styles.input3}
        onChangeText={(budjetti) => setBudjetti(budjetti)}
        value={budjetti}
        placeholder="Anna Budjetti"
        keyboardType="numeric"
      />

        <Text style = {styles.text2}>
          Kuukausittaiset asumismenot (€) :
        </Text>

      <TextInput
        style={styles.input3}
        onChangeText={(asumisMenot) => setAsumisMenot(asumisMenot)}
        value={asumisMenot}
        placeholder="Anna Asumismenot"
        keyboardType="numeric"
      />

      <Button onPress={tallennaKuukausi} title="Tallenna Budjetti ja Asumismenot" color='forestgreen' />

      <Text></Text>
      <Text></Text>

      <Text style = {styles.text2}> Lisää menoerän kuvaus ja summa</Text>


      <TextInput placeholder='Menoerä' style={{marginTop: 30, fontSize: 25, width: 350, marginLeft: 10, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(menoerä) => setMenoerä(menoerä)}
        value={menoerä}/>  

      <TextInput placeholder='Summa' style={{ marginTop: 5, marginBottom: 5, marginLeft: 10,  fontSize:25, width: 350, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(summa) => setSumma(summa)}
        value={summa}/>   

      <Button onPress={tallennaMeno} title="Tallenna" color='green' /> 
      <Text></Text>
      <Text style={{fontSize: 18}}>
          Rahaa käytettävissä tässä kuussa : {kaytettavissa} €
      </Text>
      <Text></Text>

        <FlatList 
        style={{marginLeft : "5%"}}
        keyExtractor={item => item.id.toString()} 
        renderItem={({item}) => <View style={styles.container3}><Text style={{fontSize: 18}}>{item.menoerä}: {item.summa} €</Text>
        <Text style={{fontSize: 18, color: 'orange'}} onPress={() => deleteItem(item.id)}> Poista</Text></View>} 
        data={tapahtuma} 
        ItemSeparatorComponent={listSeparator} 
      />

</View>
</ScrollView>
</SafeAreaProvider>
  );
}

//Budjettisivu LOPPUU
//Budjettisivu LOPPUU

function OmatTiedot({ route, navigation}) {

  const taustakuva = { uri: "https://reactjs.org/logo-og.png" };
  const [kotiOsoite, setKotiOsoite] = useState('');
  const [mökkiOsoite, setMökkiOsoite] = useState('');
  const [selectedPicture, setSelectedPicture] = useState();
  
  const [hasCameraPermission, setPermission] = useState(null);
  const [photoName, setPhotoName] = useState('');
  const [photoBase64, setPhotoBase64] = useState('');

  const camera = useRef(null);

  useEffect(() => {
    askCameraPermission();
  }, []);

  const askCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setPermission(status == 'granted');
  }

  const snap = async () => {
    if (camera) {
      const photo = await camera.current.takePictureAsync({ base64: true });
      setPhotoName(photo.uri);
      setPhotoBase64(photo.base64);
    }
  };

  return (
    <SafeAreaProvider>

    <ScrollView>

    <Text>KÄYTTÄJÄ:</Text>
    <Text>     Jantsi-</Text>

    <View>
    <Avatar
    rounded
    source={{
      uri: 'https://iconape.com/wp-content/png_logo_vector/avatar-4.png',
    }}
    size="large"
     />

<Tooltip popover={<Text>Et voi vaihtaa kuvaa tässä versiossa!</Text>}>
  <Text>Vaihda kuva</Text>
</Tooltip>

<Picker
        selectedValue={selectedPicture}
        style={{ height: 50, width: 200 }}
        onValueChange={(itemValue, itemIndex) => {
          if (itemIndex != 0) {
            setSelectedPicture(itemValue)
          }
        }}>
        <Picker.Item label="Mies" value="" />
        <Picker.Item label="Nainen" value= '1' />
        <Picker.Item label="Superhero" value= '1' />
        
      </Picker>

  <Badge
    status="success"
    containerStyle={{ position: 'absolute', top: -4, right: -4 }}
  />
</View>

<View style={{ flex: 1 }}>
      {hasCameraPermission ?
        (
          <View style={{ flex: 1 }}>
            <Camera style={{ flex: 4 }} ref={camera} />
            <View>
              <Button title="Ota profiilikuva kameralla" onPress={snap} />
            </View>
            <View style={{ flex: 4 }}>
              {
                photoName
                  ? <Image style={{ flex: 1 }} source={{ uri: photoName }} />
                  : <Text style={{ flex: 1 }}>File</Text>
              }
              {
                photoBase64
                  ? <Image style={{ flex: 1 }} source={{ uri: `data:image/gif;base64,${photoBase64}` }} />
                  : <Text style={{ flex: 1 }} >Base64 encoded picture</Text>
              }
            </View>
          </View>
        ) : (
          <Text>No access to camera</Text>
        )}
    </View>


<View style={styles.tausta}>
    <ImageBackground source={taustakuva} resizeMode="cover" style={styles.taustakuva}>

  <Input
   placeholder="NIMI"
   leftIcon={{ type: 'font-awesome', name: 'comment' }}
   style={styles.input2}
   color= 'white'
  />

<Input
   placeholder="Koulutus"
   leftIcon={{ type: 'font-awesome', name: 'comment' }}
   style={styles.input2}
   color= 'white'
  />

<Input
   placeholder="Kotiosoite"
   leftIcon={{ type: 'font-awesome', name: 'comment' }}
   style={styles.input2}
   color= 'white'
   onChangeText={(kotiOsoite) => setKotiOsoite(kotiOsoite)}
   value={kotiOsoite}
  />

<Input
   placeholder="Puhelinnumero"
   leftIcon={{ type: 'font-awesome', name: 'comment' }}
   style={styles.input2}
   color= 'white'
  />
  <Input
   placeholder="Mökin osoite"
   leftIcon={{ type: 'font-awesome', name: 'comment' }}
   style={styles.input2}
   color= 'white'
   onChangeText={(mökkiOsoite) => setMökkiOsoite(mökkiOsoite)}
   value={mökkiOsoite}
  />

    </ImageBackground>
</View>

</ScrollView>
    </SafeAreaProvider>
    
  );
}

const screenOptions = ({ route }) => ({
  tabBarIcon: ({ focused, color, size }) => {
    let iconName;

    if (route.name === 'Muistilista') {
      iconName = 'calendar';
    } else if (route.name === 'Omat Tiedot') {
      iconName = 'person';
    } else if (route.name === 'Budjetti') {
      iconName = 'map';
    }
    return <Ionicons name={iconName} size= {size} color={color} />;
  }
});

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen name="Muistilista"  component={KotiSivu} />
        <Tab.Screen name="Omat Tiedot" component={OmatTiedot} />
        <Tab.Screen name="Budjetti" component={BudjettiSivu} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

//TYYLIT ALKAA

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container2: {
    flex: 2,
    backgroundColor: 'gainsboro',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container3: {
    flex: 2,
    backgroundColor: 'gainsboro',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 115,
    flexDirection: 'row',
    marginBottom: 10,
  },
  input: {
    borderColor: 'grey',
    borderWidth: 2,
    padding: 4,
    margin: 5,
    width: '40%',
  },
  input2: {
    borderColor: 'white',
    borderWidth: 3,
    padding: 10,
    margin: 5,
    width: '40%',
  },
  input3: {
    borderColor: 'black',
    borderWidth: 3,
    padding: 20,
    margin: 10,
    width: '70%',
    fontSize: 24
  },
  operaattorit: {
    width: '40%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  taustakuva: {
    flex: 3,
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
    flex: 1
  },
  tausta: {
    flex: 1,
  },
  scrollView: {
    marginHorizontal: 10
  },
  text: {
    color: "white",
    fontSize: 42,
    lineHeight: 84,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#000000c0"
  },
  text2: {
    color: "white",
    fontSize: 20,
    lineHeight: 30,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#000000c0"
  },
  button: {
    height: 150,
    width: '100%'
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
  },
  textStyle: {
    padding: 10,
    color: 'black',
  },
  buttonStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#DDDDDD',
    padding: 5,
  },
  imageStyle: {
    width: 100,
    height: 100,
    margin: 5,
  },
  nappula: {
    margin: 5,
    width: '100%'
    
  }
});