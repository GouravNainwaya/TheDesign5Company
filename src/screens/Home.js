import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { clearToDataArray, loadAsyncData, pushToDataArray, selectDataArray } from '../redux/dataSlice';
import { useDispatch, useSelector } from 'react-redux';

const PostItem = ({title, body}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
};

const AddPostModal = ({visible, onClose, onSave}) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSave = () => {
    if (title && body) {
      onSave({title, body});
      onClose();
    } else {
      Alert.alert('Error', 'Please enter both title and body.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            placeholderTextColor={"black"}
            onChangeText={text => setTitle(text)}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Body"
            placeholderTextColor={"black"}
            multiline
            numberOfLines={4}
            value={body}
            onChangeText={text => setBody(text)}
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();

  const dataArray = useSelector(selectDataArray);

  useEffect(() => {
    // Fetch posts from the API
    axios
      .get('https://jsonplaceholder.typicode.com/posts')
      .then(response => {
        setPosts([...response.data, ...dataArray]);
        setFilteredPosts([...response.data, ...dataArray]);
      })
      .catch(error => console.error('Error fetching posts:', error));
  }, [dispatch, , dataArray]);

    // Load data from AsyncStorage on component mount
    useEffect(() => {
        dispatch(loadAsyncData());
      }, [dispatch]);

  const onChangeText = text => {
    setSearchTerm(text);
    const filteredPosts = posts.filter(post =>
      post.title.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredPosts(filteredPosts); // Corrected line
  };

  const toggleModal = () => setModalVisible(!isModalVisible);

  const clearStorage = async () => {
    try {
      await AsyncStorage.clear();
      dispatch(clearToDataArray());
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  };

  // Function to push data to the array
  const savePostToStorage = newPost => {
    try {
      const newData = {};
      dispatch(pushToDataArray(newPost));
      setFilteredPosts([...posts, ...dataArray])
    } catch (error) {
      console.error('Error saving post to storage:', error);
    }
  };

//   console.log("filtersd", JSON.stringify(filteredPosts,null, 2));
  console.log("searchTerm", searchTerm);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search posts..."
        value={searchTerm}
        onChangeText={onChangeText}
      />
      <FlatList
        data={filteredPosts.reverse()}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <PostItem title={item.title} body={item.body} />
        )}
      />
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.addButton} onPress={toggleModal}>
          <Text style={styles.addButtonText}>Add Post</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearButton} onPress={clearStorage}>
          <Text style={styles.clearButtonText}>Clear Storage</Text>
        </TouchableOpacity>
      </View>
      <AddPostModal
        visible={isModalVisible}
        onClose={toggleModal}
        onSave={savePostToStorage}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#191010'
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
    color: 'black'
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    color: 'black'
  },
  saveButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  addButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '48%',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '48%',
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  body: {
    fontSize: 16,
  },
});
