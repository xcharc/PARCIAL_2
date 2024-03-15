import React, { useState } from 'react';
import { StatusBar, StyleSheet, Text, View, Button, ScrollView, ActivityIndicator } from 'react-native';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataType, setDataType] = useState('IDs');

  const fetchData = async (option, dataType) => {
    setIsLoading(true);
    try {
      let url = `https://jsonplaceholder.typicode.com/todos${option}`;
      switch(dataType) {
        case 'IDs':
          url += '?_fields=id';
          break;
        case 'IDs y títulos':
          url += '?_fields=id,title'; 
          break;
        case 'Sin resolver(ID y titulo)':
          url += '?completed=false&_fields=id,title';
          break;
        case 'Resueltos(ID y titulo)':
          url += '?completed=true&_fields=id,title';
          break;
        case 'ID y userID':
          url += '?_fields=id,userId';
          break;
        case 'Resueltos (ID y userID)':
          url += '?completed=true&_fields=id,userId';
          break;
        case 'Sin resolver (ID y userID)':
          url += '?completed=false&_fields=id,userId';
          break;
        default:
          break;
      }

      const response = await fetch(url);
      const data = await response.json();

      const formattedData = data.map(todo => ({
        id: todo.id,
        userId: todo.userId ? todo.userId : 'N/A', 
        title: todo.title,
      }));

      setTodos(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Inform the user about the error
    }
    setIsLoading(false);
  };

  const handleButtonPress = (dataType) => {
    setDataType(dataType);
    fetchData('', dataType);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lista de Pendientes</Text>
      <View style={styles.buttonContainer}>
        {['IDs', 'IDs y títulos', 'Sin resolver(ID y titulo)', 'Resueltos(ID y titulo)', 'ID y userID', 'Resueltos (ID y userID)', 'Sin resolver (ID y userID)'].map((type, index) => (
          <Button key={index} title={type} onPress={() => handleButtonPress(type)} />
        ))}
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView style={styles.scrollView}>
          <View style={styles.listContainer}>
            {todos.map(todo => {
              let textToDisplay = '';
              switch(dataType) {
                case 'IDs':
                  textToDisplay = todo.id;
                  break;
                case 'IDs y títulos':
                  textToDisplay = `${todo.id} - ${todo.title}`;
                  break;
                case 'Sin resolver(ID y titulo)':
                  textToDisplay = `${todo.id} - ${todo.title} (sin resolver)`;
                  break;
                case 'Resueltos(ID y titulo)':
                  textToDisplay = `${todo.id} - ${todo.title} (resuelto)`;
                  break;
                default:
                  textToDisplay = `${todo.id} (userID: ${todo.userId})`;
                  break;
              }
              return <Text key={todo.id}>{textToDisplay}</Text>;
            })}
          </View>
        </ScrollView>
      )}
      <StatusBar style="auto" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  listContainer: {
    alignItems: 'center',
  },
});
