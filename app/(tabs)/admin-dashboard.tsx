import { ThemedText } from '@/components/ThemedText';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, TouchableOpacity, View } from 'react-native';
import adminPostsStyles from '../../styles/adminPostsStyles';

type Post = {
  id: string;
  title: string;
  author: string;
  date: string;
  likes: number;
  likedByMe?: boolean;
};

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // Simulated fetch
    setPosts([
      { id: '1', title: 'First Post', author: 'Jane Doe', date: '2025-07-20', likes: 2, likedByMe: false },
      { id: '2', title: 'Second Post', author: 'John Smith', date: '2025-07-19', likes: 0, likedByMe: false },
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
    Alert.alert('Edit', `Editing post ID: ${postId}`);
  };

  // Like/Unlike handler
  const handleLike = (postId: string) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              likes: post.likedByMe ? post.likes - 1 : post.likes + 1,
              likedByMe: !post.likedByMe,
            }
          : post
      )
    );
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={adminPostsStyles.postCard}>
      <View style={adminPostsStyles.postInfo}>
        <ThemedText type="subtitle">{item.title}</ThemedText>
        <ThemedText type="default">By {item.author}</ThemedText>
        <ThemedText type="default">{item.date}</ThemedText>
      </View>
      <View style={adminPostsStyles.actionButtons}>
        <TouchableOpacity
          onPress={() => handleLike(item.id)}
          style={adminPostsStyles.iconButton}
        >
          <Ionicons
            name={item.likedByMe ? 'heart' : 'heart-outline'}
            size={20}
            color={item.likedByMe ? '#e74c3c' : '#888'}
          />
          <ThemedText style={{ marginLeft: 4 }}>{item.likes}</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleEdit(item.id)} style={adminPostsStyles.iconButton}>
          <MaterialIcons name="edit" size={20} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={adminPostsStyles.iconButton}>
          <MaterialIcons name="delete" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={adminPostsStyles.container}>
      <ThemedText type="title">Admin Dashboard</ThemedText>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={renderPost}
        contentContainerStyle={adminPostsStyles.listContainer}
        ListEmptyComponent={
          <ThemedText style={{ textAlign: 'center', marginTop: 32, color: '#888' }}>
            No posts yet.
          </ThemedText>
        }
      />
    </View>
  );
}
