// HAPPY SHARE - 文件卡片組件

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import type { Attachment } from '../../types/search';

interface FileCardProps {
  file: Attachment;
  onPress?: (file: Attachment) => void;
}

export const FileCard: React.FC<FileCardProps> = ({ file, onPress }) => {
  const { theme } = useTheme();

  const handlePress = () => {
    if (onPress) {
      onPress(file);
    } else {
      // 默認打開文件鏈接
      Linking.openURL(file.url).catch((err) =>
        console.error('Failed to open file:', err)
      );
    }
  };

  const getFileIcon = (mimeType: string): keyof typeof Ionicons.glyphMap => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'videocam';
    if (mimeType.startsWith('audio/')) return 'musical-notes';
    if (mimeType.includes('pdf')) return 'document-text';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'document';
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'grid';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'easel';
    if (mimeType.includes('zip') || mimeType.includes('compressed')) return 'archive';
    return 'document-attach';
  };

  const getFileIconColor = (mimeType: string): string => {
    if (mimeType.startsWith('image/')) return '#34C759';
    if (mimeType.startsWith('video/')) return '#5856D6';
    if (mimeType.startsWith('audio/')) return '#FF9500';
    if (mimeType.includes('pdf')) return '#FF3B30';
    if (mimeType.includes('word')) return '#007AFF';
    if (mimeType.includes('sheet')) return '#34C759';
    if (mimeType.includes('presentation')) return '#FF9500';
    if (mimeType.includes('zip')) return '#8E8E93';
    return theme.colors.primary;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.colors.surface }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: getFileIconColor(file.mimeType) + '20' },
        ]}
      >
        <Ionicons
          name={getFileIcon(file.mimeType)}
          size={24}
          color={getFileIconColor(file.mimeType)}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text
          style={[styles.fileName, { color: theme.colors.onSurface }]}
          numberOfLines={2}
        >
          {file.originalName}
        </Text>
        <View style={styles.metaContainer}>
          <Text style={[styles.fileSize, { color: theme.colors.onSurfaceVariant }]}>
            {formatFileSize(file.size)}
          </Text>
          {file.uploader && (
            <>
              <Text style={[styles.separator, { color: theme.colors.onSurfaceVariant }]}>
                •
              </Text>
              <Text style={[styles.uploader, { color: theme.colors.onSurfaceVariant }]}>
                {file.uploader.name}
              </Text>
            </>
          )}
        </View>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color={theme.colors.onSurfaceVariant}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    gap: 4,
  },
  fileName: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fileSize: {
    fontSize: 13,
  },
  separator: {
    fontSize: 13,
  },
  uploader: {
    fontSize: 13,
  },
});
