import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Avatar, Chip } from 'react-native-paper';
import { Post } from '../../types/post';
import { useAppTheme } from '../../providers/ThemeProvider';

interface PostCardProps {
  post: Post;
  onPress?: () => void;
}

export const PostCard = memo<PostCardProps>(({ post, onPress }) => {
  const { theme } = useAppTheme();
  const formattedDate = new Date(post.createdAt).toLocaleDateString();

  return (
    <Card 
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface }
      ]} 
      onPress={onPress}
    >
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.authorInfo}>
            {post.author.avatar ? (
              <Avatar.Image size={40} source={{ uri: post.author.avatar }} />
            ) : (
              <Avatar.Text 
                size={40} 
                label={post.author.username[0].toUpperCase()}
                color={theme.colors.onPrimary}
                style={{ backgroundColor: theme.colors.primary }}
              />
            )}
            <View style={styles.authorText}>
              <Text 
                variant="titleMedium" 
                style={{ color: theme.colors.onSurface }}
              >
                {post.author.username}
              </Text>
              <Text 
                variant="bodySmall" 
                style={{ color: theme.colors.secondary }}
              >
                {formattedDate}
              </Text>
            </View>
          </View>
        </View>

        <Text 
          variant="titleLarge" 
          style={[
            styles.title,
            { color: theme.colors.onSurface }
          ]}
        >
          {post.title}
        </Text>
        
        <Text 
          variant="bodyMedium" 
          style={[
            styles.content,
            { color: theme.colors.onSurfaceVariant }
          ]} 
          numberOfLines={3}
        >
          {post.content}
        </Text>

        {post.tags && post.tags.length > 0 && (
          <View style={styles.tags}>
            {post.tags.map(tag => (
              <Chip 
                key={tag} 
                style={[
                  styles.tag,
                  {
                    backgroundColor: theme.colors.secondaryContainer,
                  }
                ]}
                textStyle={{ color: theme.colors.onSecondaryContainer }}
              >
                {tag}
              </Chip>
            ))}
          </View>
        )}

        <View style={styles.footer}>
          <Text 
            variant="bodySmall"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            ❤️ {post.likes}
          </Text>
          <Text 
            variant="bodySmall"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            💬 {post.comments}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
});

PostCard.displayName = 'PostCard';

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorText: {
    marginLeft: 12,
  },
  title: {
    marginBottom: 8,
  },
  content: {
    marginBottom: 12,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    marginRight: 8,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});