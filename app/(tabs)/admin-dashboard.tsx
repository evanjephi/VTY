import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, TouchableOpacity, View } from 'react-native';
import adminPostsStyles from '../../styles/adminPostsStyles';

type Post = {
  id: string;
  title: string;
  author: string;
  date: string;
};

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);

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
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={adminPostsStyles.postCard}>
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
      />
    </View>
  );
}
