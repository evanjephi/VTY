import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { addDoc, collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from '../../firebaseConfig';
import adminPostsStyles from '../../styles/adminPostsStyles';

//admin posts using type to strict variable declaration
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

    // Fetch posts from Firestore, disabled for now
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

    // handle post to Add a new post
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

    const RenderPost = React.memo(({ item }: { item: Post }) => (
        <View style= { adminPostsStyles.postCard } >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Ionicons name="person-circle-outline" size = { 24} color = "#4F8EF7" style = {{ marginRight: 8 }} />
                < ThemedText type = "subtitle" style = { adminPostsStyles.postTitle } > { item.title } </ThemedText>
                    </View>
                    < ThemedText style = { adminPostsStyles.postContent } > { item.content } </ThemedText>
                        < ThemedText style = { adminPostsStyles.postDate } >
                            { item.createdAt.toDate().toLocaleString() }
                            </ThemedText>
                            </View>
  );

return (
    <ThemedView style= { adminPostsStyles.container } >
    <KeyboardAvoidingView
        behavior={ Platform.OS === 'ios' ? 'padding' : undefined }
style = {{ flex: 1 }}
keyboardVerticalOffset = { 80}
    >
    <ThemedText type="title" style = { adminPostsStyles.header } >
          📢 Admin Board
    </ThemedText>
    < ThemedText type = "subtitle" style = { adminPostsStyles.subHeader } >
        Create a new post to engage your audience!
            </ThemedText>
            < View style = { adminPostsStyles.formCard } >
                <TextInput
            style={ adminPostsStyles.input }
placeholder = "Post Title"
value = { title }
onChangeText = { setTitle }
placeholderTextColor = "#888"
    />
    <TextInput
            style={ [adminPostsStyles.input, { height: 80 }] }
placeholder = "What's on your mind?"
value = { content }
onChangeText = { setContent }
multiline
placeholderTextColor = "#888"
    />
    <TouchableOpacity style={ adminPostsStyles.postButton } onPress = { handlePost } >
        <Ionicons name="send" size = { 20} color = "#fff" />
            <ThemedText style={ adminPostsStyles.postButtonText }> Post </ThemedText>
                </TouchableOpacity>
                </View>
                < ThemedText type = "subtitle" style = { adminPostsStyles.postsHeader } >
                    Recent Posts
                        </ThemedText>
{
    loading ? (
        <ActivityIndicator style= {{ marginTop: 20 }
} />
) : (
    <FlatList
    data= { posts }
keyExtractor = { item => item.id }
refreshing = { loading }
onRefresh = { fetchPosts }
renderItem = { renderPost }
contentContainerStyle = {{ paddingBottom: 40 }}
ListEmptyComponent = {
      < ThemedText style = {{ textAlign: 'center', marginTop: 32, color: '#888' }}>
    No posts yet.Start the conversation!
        </ThemedText>
    }
  />
)}
</KeyboardAvoidingView>
    </ThemedView>
  );
}
