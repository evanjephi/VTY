import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { addDoc, collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
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

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
        <Ionicons name="person-circle-outline" size={24} color="#4F8EF7" style={{ marginRight: 8 }} />
        <ThemedText type="subtitle" style={styles.postTitle}>{item.title}</ThemedText>
      </View>
      <ThemedText style={styles.postContent}>{item.content}</ThemedText>
      <ThemedText style={styles.postDate}>
        {item.createdAt.toDate().toLocaleString()}
      </ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={80}
      >
        <ThemedText type="title" style={styles.header}>
          📢 Admin Board
        </ThemedText>
        <ThemedText type="subtitle" style={styles.subHeader}>
          Create a new post to engage your audience!
        </ThemedText>
        <View style={styles.formCard}>
          <TextInput
            style={styles.input}
            placeholder="Post Title"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#888"
          />
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="What's on your mind?"
            value={content}
            onChangeText={setContent}
            multiline
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.postButton} onPress={handlePost}>
            <Ionicons name="send" size={20} color="#fff" />
            <ThemedText style={styles.postButtonText}>Post</ThemedText>
          </TouchableOpacity>
        </View>
        <ThemedText type="subtitle" style={styles.postsHeader}>
          Recent Posts
        </ThemedText>
        <FlatList
          data={posts}
          keyExtractor={item => item.id}
          refreshing={loading}
          onRefresh={fetchPosts}
          renderItem={renderPost}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={
            <ThemedText style={{ textAlign: 'center', marginTop: 32, color: '#888' }}>
              No posts yet. Start the conversation!
            </ThemedText>
          }
        />
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F4F8FB',
  },
  header: {
    fontSize: 28,
    marginBottom: 4,
    textAlign: 'center',
    color: '#4F8EF7',
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    color: '#555',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#4F8EF7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E7EF',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#F8FAFC',
    fontSize: 16,
    color: '#222',
  },
  postButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F8EF7',
    borderRadius: 8,
    paddingVertical: 10,
    justifyContent: 'center',
    marginTop: 4,
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  postsHeader: {
    fontSize: 20,
    marginBottom: 12,
    color: '#4F8EF7',
    fontWeight: 'bold',
    marginTop: 8,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#4F8EF7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  postTitle: {
    fontSize: 18,
    color: '#222',
    fontWeight: '600',
  },
  postContent: {
    fontSize: 16,
    color: '#444',
    marginBottom: 8,
    marginTop: 2,
  },
  postDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 6,
    textAlign: 'right',
  },
});