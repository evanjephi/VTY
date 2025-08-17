import { ThemedText } from '@/components/ThemedText';
<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Alert } from 'react-native';
import adminPostsStyles from '../../styles/adminPostsStyles';
import { db } from '../../firebaseConfig';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
=======
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, TouchableOpacity, View } from 'react-native';
import adminPostsStyles from '../../styles/adminPostsStyles';
>>>>>>> 04e777af82e13db2f7559e9e61727d9b9bd5806e

type Post = {
  id: string;
  title: string;
<<<<<<< HEAD
  content: string;
  likes?: number;
=======
  author: string;
  date: string;
>>>>>>> 04e777af82e13db2f7559e9e61727d9b9bd5806e
};

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
<<<<<<< HEAD
  const [loading, setLoading] = useState(false);

  // Fetch posts from Firestore
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'posts'));
      const loadedPosts: Post[] = [];
      querySnapshot.forEach(docSnap => {
        loadedPosts.push({ id: docSnap.id, ...(docSnap.data() as Omit<Post, 'id'>) });
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

  // Handle for likes
  const handleLike = async (postId: string, currentLikes: number = 0) => {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, { likes: currentLikes + 1 });
      fetchPosts();
    } catch (e) {
      Alert.alert('Error', 'Failed to like post.');
    }
=======

  useEffect(() => {
    // Simulated fetch
    setPosts([
      { id: '1', title: 'First Post', author: 'Jane Doe', date: '2025-07-20' },
      { id: '2', title: 'Second Post', author: 'John Smith', date: '2025-07-19' },
    ]);
  }, []);

  const handleDelete = (postId: string) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this post?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setPosts(prev => prev.filter(post => post.id !== postId));
        },
      },
    ]);
  };

  const handleEdit = (postId: string) => {
    // Navigate to edit screen (or open modal)
    Alert.alert('Edit', `Editing post ID: ${postId}`);
>>>>>>> 04e777af82e13db2f7559e9e61727d9b9bd5806e
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={adminPostsStyles.postCard}>
<<<<<<< HEAD
      <ThemedText style={adminPostsStyles.postTitle}>{item.title}</ThemedText>
      <ThemedText style={adminPostsStyles.postContent}>{item.content}</ThemedText>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}
          onPress={() => handleLike(item.id, item.likes || 0)}
        >
          <Ionicons name="heart" size={20} color="#e74c3c" />
          <ThemedText style={{ marginLeft: 6 }}>{item.likes || 0}</ThemedText>
        </TouchableOpacity>
        {/* You can add more reactions here */}
=======
      <View style={adminPostsStyles.postInfo}>
        <ThemedText type="subtitle">{item.title}</ThemedText>
        <ThemedText type="default">By {item.author}</ThemedText>
        <ThemedText type="default">{item.date}</ThemedText>
      </View>
      <View style={adminPostsStyles.actionButtons}>
        <TouchableOpacity onPress={() => handleEdit(item.id)} style={adminPostsStyles.iconButton}>
          <MaterialIcons name="edit" size={20} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={adminPostsStyles.iconButton}>
          <MaterialIcons name="delete" size={20} color="#FF3B30" />
        </TouchableOpacity>
>>>>>>> 04e777af82e13db2f7559e9e61727d9b9bd5806e
      </View>
    </View>
  );

  return (
    <View style={adminPostsStyles.container}>
      <ThemedText type="title">Admin Dashboard</ThemedText>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
<<<<<<< HEAD
        refreshing={loading}
        onRefresh={fetchPosts}
        renderItem={renderPost}
        ListEmptyComponent={
          <ThemedText style={{ textAlign: 'center', marginTop: 32, color: '#888' }}>
            No posts yet.
          </ThemedText>
        }
=======
        renderItem={renderPost}
        contentContainerStyle={adminPostsStyles.listContainer}
>>>>>>> 04e777af82e13db2f7559e9e61727d9b9bd5806e
      />
    </View>
  );
}
