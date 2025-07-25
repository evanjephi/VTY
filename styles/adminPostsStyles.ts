import { StyleSheet } from 'react-native';
//adminstyles
const adminPostsStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
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
  commentsSection: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E7EF',
    paddingTop: 12,
  },
  commentBubble: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    maxWidth: '80%',
  },
  commentAuthor: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#E0E7EF',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#F8FAFC',
    fontSize: 16,
    color: '#222',
  },
  listContainer: {
    paddingTop: 16,
  },
  // postCard: {
  //   backgroundColor: '#FFFFFF',
  //   borderRadius: 8,
  //   padding: 12,
  //   marginBottom: 12,
  //   shadowColor: '#000',
  //   shadowOpacity: 0.1,
  //   shadowRadius: 4,
  //   elevation: 2,
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  // },
  postInfo: {
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    marginLeft: 12,
  },
  iconButton: {
    marginHorizontal: 6,
    padding: 4,
  },
});

export default adminPostsStyles;
