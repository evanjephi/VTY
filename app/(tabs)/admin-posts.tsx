import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { addDoc, collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, TextInput, View } from 'react-native';
import { db } from '../../firebaseConfig';

type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: Timestamp;
};

export default function AdminPostsScreen() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch posts from Firestore
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const loadedPosts: Post[] = [];
      querySnapshot.forEach(doc => {
        loadedPosts.push({ id: doc.id, ...(doc.data() as Omit<Post, 'id'>) });
      });
      setPosts(loadedPosts);
    } catch (e) {
      Alert.alert('Error', 'Failed to fetch posts.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Add a new post
  const handlePost = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Validation', 'Title and content are required.');
      return;
    }
    try {
      await addDoc(collection(db, 'posts'), {
        title,
        content,
        createdAt: Timestamp.now(),
      });
      setTitle('');
      setContent('');
      fetchPosts();
      Alert.alert('Success', 'Post created!');
    } catch (e) {
      Alert.alert('Error', 'Failed to create post.');
    }
  };

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      <ThemedText type="title" style={{ marginBottom: 12 }}>Admin: Create Post</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Content"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <Button title="Post" onPress={handlePost} />
      <ThemedText type="subtitle" style={{ marginTop: 24, marginBottom: 8 }}>Posts</ThemedText>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        refreshing={loading}
        onRefresh={fetchPosts}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <ThemedText type="subtitle">{item.title}</ThemedText>
            <ThemedText>{item.content}</ThemedText>
            <ThemedText style={styles.date}>
              {item.createdAt.toDate().toLocaleString()}
            </ThemedText>
          </View>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  post: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
});