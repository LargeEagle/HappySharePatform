import type { Location } from '../types/post';

/**
 * 使用 Haversine 公式計算兩個地理坐標之間的距離
 * @param lat1 第一個點的緯度
 * @param lon1 第一個點的經度
 * @param lat2 第二個點的緯度
 * @param lon2 第二個點的經度
 * @returns 距離（公里）
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // 地球半徑（公里）
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

/**
 * 計算兩個 Location 對象之間的距離
 */
export function getDistanceBetweenLocations(
  location1: Location,
  location2: Location
): number {
  return calculateDistance(
    location1.latitude,
    location1.longitude,
    location2.latitude,
    location2.longitude
  );
}

/**
 * 將角度轉換為弧度
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * 格式化距離顯示
 * @param distanceKm 距離（公里）
 * @returns 格式化的距離字符串
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    // 小於 1 公里，顯示米
    const meters = Math.round(distanceKm * 1000);
    return `${meters}m`;
  } else if (distanceKm < 10) {
    // 1-10 公里，顯示一位小數
    return `${distanceKm.toFixed(1)}km`;
  } else {
    // 10 公里以上，顯示整數
    return `${Math.round(distanceKm)}km`;
  }
}

/**
 * 檢查位置是否在指定半徑內
 */
export function isWithinRadius(
  location1: Location,
  location2: Location,
  radiusKm: number
): boolean {
  const distance = getDistanceBetweenLocations(location1, location2);
  return distance <= radiusKm;
}

/**
 * 根據距離對文章列表排序
 */
export function sortPostsByDistance<T extends { location?: Location }>(
  posts: T[],
  userLocation: Location
): T[] {
  return [...posts].sort((a, b) => {
    if (!a.location && !b.location) return 0;
    if (!a.location) return 1;
    if (!b.location) return -1;
    
    const distanceA = getDistanceBetweenLocations(userLocation, a.location);
    const distanceB = getDistanceBetweenLocations(userLocation, b.location);
    
    return distanceA - distanceB;
  });
}

/**
 * 篩選指定半徑內的文章
 */
export function filterPostsByRadius<T extends { location?: Location }>(
  posts: T[],
  userLocation: Location,
  radiusKm: number
): T[] {
  return posts.filter(post => {
    if (!post.location) return false;
    return isWithinRadius(userLocation, post.location, radiusKm);
  });
}

/**
 * 為文章列表添加距離信息
 */
export interface PostWithDistance<T> extends Record<string, any> {
  post: T;
  distance?: number; // 距離（公里）
  distanceFormatted?: string; // 格式化的距離
}

export function addDistanceToPost<T extends { location?: Location }>(
  post: T,
  userLocation: Location | null
): PostWithDistance<T> {
  if (!userLocation || !post.location) {
    return { post };
  }
  
  const distance = getDistanceBetweenLocations(userLocation, post.location);
  
  return {
    post,
    distance,
    distanceFormatted: formatDistance(distance),
  };
}

export function addDistanceToPosts<T extends { location?: Location }>(
  posts: T[],
  userLocation: Location | null
): PostWithDistance<T>[] {
  return posts.map(post => addDistanceToPost(post, userLocation));
}
