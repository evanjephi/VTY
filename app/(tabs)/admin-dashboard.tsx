import { ThemedText } from '@/components/ThemedText';
import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Alert } from 'react-native';
import adminPostsStyles from '../../styles/adminPostsStyles';
import { db } from '../../firebaseConfig';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

type Post = {
  id: string;
  title: string;
  content: string;
  likes?: number;
};

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
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

  // Handle like
  const handleLike = async (postId: string, currentLikes: number = 0) => {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, { likes: currentLikes + 1 });
      fetchPosts();
    } catch (e) {
      Alert.alert('Error', 'Failed to like post.');
    }
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={adminPostsStyles.postCard}>
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
      </View>
    </View>
  );

  return (
    <View style={adminPostsStyles.container}>
      <ThemedText type="title">Admin Dashboard</ThemedText>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        refreshing={loading}
        onRefresh={fetchPosts}
        renderItem={renderPost}
        ListEmptyComponent={
          <ThemedText style={{ textAlign: 'center', marginTop: 32, color: '#888' }}>
            No posts yet.
          </ThemedText>
        }
      />
    </View>
  );
}