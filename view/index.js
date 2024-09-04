// views/NameListView.js
import React from 'react';
import { View, Text, Button, TextInput, FlatList } from 'react-native';

const Index = ({ names, onAdd, onUpdate, onDelete }) => {
  const [currentName, setCurrentName] = React.useState('');

  return (
    <View>
      <TextInput
        placeholder="Digite o nome"
        value={currentName}
        onChangeText={setCurrentName}
      />
      <Button title="Adicionar" onPress={() => onAdd(currentName)} />
      <FlatList
        data={names}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            <Button title="Atualizar" onPress={() => onUpdate(item.id)} />
            <Button title="Deletar" onPress={() => onDelete(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

export default Index;
