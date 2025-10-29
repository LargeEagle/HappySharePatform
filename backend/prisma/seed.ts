import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 開始數據填充...');

  // 清除現有數據（開發環境）
  console.log('🗑️  清除現有數據...');
  await prisma.like.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // 創建測試用戶
  console.log('👥 創建測試用戶...');
  
  // 所有測試帳號的密碼：Test@1234 (符合新的密碼規則)
  const hashedPassword = await bcrypt.hash('Test@1234', 10);

  const user1 = await prisma.user.create({
    data: {
      email: 'alice@happyshare.com',
      username: 'alice',
      password: hashedPassword,
      name: 'Alice Wang',
      bio: '喜歡分享生活中的美好時刻 ✨',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'bob@happyshare.com',
      username: 'bob',
      password: hashedPassword,
      name: 'Bob Chen',
      bio: '攝影愛好者 📷 | 旅行者 🌍',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'carol@happyshare.com',
      username: 'carol',
      password: hashedPassword,
      name: 'Carol Lee',
      bio: '美食探索者 🍜 | 分享快樂',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
  });

  const user4 = await prisma.user.create({
    data: {
      email: 'david@happyshare.com',
      username: 'david',
      password: hashedPassword,
      name: 'David Lin',
      bio: '科技愛好者 💻 | 學習分享',
      avatar: 'https://i.pravatar.cc/150?img=4',
    },
  });

  const user5 = await prisma.user.create({
    data: {
      email: 'emma@happyshare.com',
      username: 'emma',
      password: hashedPassword,
      name: 'Emma Zhang',
      bio: '音樂人 🎵 | 創作分享',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
  });

  console.log(`✅ 創建了 5 位用戶`);

  // 創建測試文章
  console.log('📝 創建測試文章...');

  const post1 = await prisma.post.create({
    data: {
      title: '今天的陽光真好！',
      content: '早上起床看到窗外的陽光，心情特別好。決定出去走走，享受這美好的一天。希望大家也能有個愉快的一天！☀️',
      isPublished: true,
      authorId: user1.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: '分享我的新攝影作品',
      content: '上週末去了陽明山，拍到了美麗的夕陽。這次嘗試了長曝光技巧，效果比預期的好。攝影真的是一門需要耐心和練習的藝術。\n\n#攝影 #陽明山 #夕陽',
      isPublished: true,
      authorId: user2.id,
    },
  });

  const post3 = await prisma.post.create({
    data: {
      title: '發現一家超棒的拉麵店！',
      content: '今天在東區發現一家隱藏的拉麵店，湯頭超濃郁，叉燒入口即化。老闆說湯頭是用豚骨熬煮12小時，難怪這麼好喝！強烈推薦給愛吃拉麵的朋友們 🍜',
      isPublished: true,
      authorId: user3.id,
    },
  });

  const post4 = await prisma.post.create({
    data: {
      title: '學習 React Native 的心得分享',
      content: '最近開始學習 React Native，發現用 Expo 真的很方便。可以同時開發 iOS 和 Android 應用，而且熱重載功能讓開發效率大大提升。\n\n如果你也想學習移動應用開發，推薦從 React Native 開始！',
      isPublished: true,
      authorId: user4.id,
    },
  });

  const post5 = await prisma.post.create({
    data: {
      title: '新歌創作中...',
      content: '最近在創作一首新歌，靈感來自於秋天的落葉。希望能把那種淡淡的憂傷和美好的回憶融入旋律中。期待完成後能分享給大家！🎵',
      isPublished: true,
      authorId: user5.id,
    },
  });

  const post6 = await prisma.post.create({
    data: {
      title: '週末爬山記',
      content: '這個週末去爬了象山，雖然只是小山，但運動後的感覺真好！站在山頂俯瞰台北101，覺得所有的辛苦都值得了。下次想挑戰更高的山！',
      isPublished: true,
      authorId: user1.id,
    },
  });

  const post7 = await prisma.post.create({
    data: {
      title: '咖啡拉花練習中',
      content: '開始學習咖啡拉花，今天終於拉出一個像樣的愛心了！雖然還不夠完美，但看到進步真的很開心。咖啡不只是飲料，更是一門藝術 ☕',
      isPublished: true,
      authorId: user3.id,
    },
  });

  const post8 = await prisma.post.create({
    data: {
      title: 'TypeScript 最佳實踐',
      content: '整理了一些 TypeScript 的最佳實踐：\n\n1. 善用 interface 和 type\n2. 避免使用 any\n3. 利用泛型增加代碼重用性\n4. 使用嚴格模式\n\n寫類型安全的代碼真的能減少很多 bug！',
      isPublished: true,
      authorId: user4.id,
    },
  });

  const post9 = await prisma.post.create({
    data: {
      title: '音樂節表演回顧',
      content: '上週末參加了春天吶喊音樂節，第一次在這麼大的舞台上表演，既緊張又興奮！感謝所有支持我的朋友們，這個經歷我會永遠記得 🎤',
      isPublished: true,
      authorId: user5.id,
    },
  });

  const post10 = await prisma.post.create({
    data: {
      title: '讀書分享：原子習慣',
      content: '最近讀完了《原子習慣》，書中提到的「每天進步1%」概念讓我印象深刻。改變不需要一次到位，持續的小改進就能帶來巨大的改變。推薦給想要養成好習慣的朋友！',
      isPublished: true,
      authorId: user2.id,
    },
  });

  // 創建一些草稿
  await prisma.post.create({
    data: {
      title: '未完成的想法',
      content: '這是一篇草稿，還在構思中...',
      isPublished: false,
      authorId: user1.id,
    },
  });

  console.log(`✅ 創建了 11 篇文章（10 篇已發布，1 篇草稿）`);

  // 創建評論
  console.log('💬 創建評論...');

  await prisma.comment.create({
    data: {
      content: '天氣好的時候心情也會跟著好起來！',
      authorId: user2.id,
      postId: post1.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: '我也超愛晴天的！☀️',
      authorId: user3.id,
      postId: post1.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: '拍得真好！可以分享一下相機設定嗎？',
      authorId: user1.id,
      postId: post2.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: '長曝光真的很有挑戰性，你拍得很棒！',
      authorId: user4.id,
      postId: post2.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: '在哪裡？可以分享地址嗎？我也想去！',
      authorId: user5.id,
      postId: post3.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: '看起來超好吃的！🍜',
      authorId: user1.id,
      postId: post3.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: '我也在學 React Native！有什麼推薦的學習資源嗎？',
      authorId: user3.id,
      postId: post4.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Expo 確實很方便，開發體驗很好！',
      authorId: user5.id,
      postId: post4.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: '期待你的新歌！一定很棒 🎵',
      authorId: user2.id,
      postId: post5.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: '秋天的氛圍很適合創作呢',
      authorId: user4.id,
      postId: post5.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: '象山的景色真的很美！',
      authorId: user3.id,
      postId: post6.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: '拉花好難，你好厲害！',
      authorId: user2.id,
      postId: post7.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: '感謝分享！這些建議很實用',
      authorId: user5.id,
      postId: post8.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: '我有看直播！你表演得超棒的！',
      authorId: user1.id,
      postId: post9.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: '這本書我也讀過，寫得很好！',
      authorId: user3.id,
      postId: post10.id,
    },
  });

  console.log(`✅ 創建了 15 條評論`);

  // 創建點讚
  console.log('👍 創建點讚...');

  // 文章點讚
  await prisma.like.createMany({
    data: [
      { userId: user2.id, postId: post1.id },
      { userId: user3.id, postId: post1.id },
      { userId: user4.id, postId: post1.id },
      { userId: user1.id, postId: post2.id },
      { userId: user3.id, postId: post2.id },
      { userId: user5.id, postId: post2.id },
      { userId: user1.id, postId: post3.id },
      { userId: user2.id, postId: post3.id },
      { userId: user4.id, postId: post3.id },
      { userId: user5.id, postId: post3.id },
      { userId: user2.id, postId: post4.id },
      { userId: user5.id, postId: post4.id },
      { userId: user1.id, postId: post5.id },
      { userId: user3.id, postId: post5.id },
      { userId: user4.id, postId: post5.id },
      { userId: user2.id, postId: post6.id },
      { userId: user4.id, postId: post7.id },
      { userId: user1.id, postId: post8.id },
      { userId: user2.id, postId: post9.id },
      { userId: user1.id, postId: post10.id },
    ],
  });

  // 評論點讚
  const comments = await prisma.comment.findMany({ take: 10 });
  await prisma.like.createMany({
    data: [
      { userId: user1.id, commentId: comments[0]?.id },
      { userId: user4.id, commentId: comments[0]?.id },
      { userId: user2.id, commentId: comments[1]?.id },
      { userId: user3.id, commentId: comments[2]?.id },
      { userId: user5.id, commentId: comments[2]?.id },
      { userId: user2.id, commentId: comments[3]?.id },
      { userId: user1.id, commentId: comments[4]?.id },
      { userId: user2.id, commentId: comments[5]?.id },
    ].filter((like) => like.commentId),
  });

  console.log(`✅ 創建了 28 個點讚`);

  // 創建收藏
  console.log('🔖 創建收藏...');

  await prisma.bookmark.createMany({
    data: [
      { userId: user1.id, postId: post2.id },
      { userId: user1.id, postId: post4.id },
      { userId: user1.id, postId: post8.id },
      { userId: user2.id, postId: post3.id },
      { userId: user2.id, postId: post10.id },
      { userId: user3.id, postId: post4.id },
      { userId: user4.id, postId: post2.id },
      { userId: user4.id, postId: post5.id },
      { userId: user5.id, postId: post8.id },
    ],
  });

  console.log(`✅ 創建了 9 個收藏`);

  // 更新用戶統計數據
  console.log('📊 更新用戶統計...');

  await updateUserStats();

  console.log('✅ 統計數據更新完成');

  console.log('\n🎉 數據填充完成！\n');
  console.log('📊 數據摘要：');
  console.log(`   - 用戶: 5 位`);
  console.log(`   - 文章: 11 篇 (10 篇已發布, 1 篇草稿)`);
  console.log(`   - 評論: 15 條`);
  console.log(`   - 點讚: 28 個`);
  console.log(`   - 收藏: 9 個`);
  console.log('\n🔑 測試帳號（所有密碼都是 Test@1234）：');
  console.log(`   - alice@happyshare.com`);
  console.log(`   - bob@happyshare.com`);
  console.log(`   - carol@happyshare.com`);
  console.log(`   - david@happyshare.com`);
  console.log(`   - emma@happyshare.com`);
}

async function updateUserStats() {
  const users = await prisma.user.findMany({
    include: {
      posts: { where: { isPublished: true } },
    },
  });

  for (const user of users) {
    const likesCount = await prisma.like.count({
      where: {
        OR: [
          { post: { authorId: user.id } },
          { comment: { authorId: user.id } },
        ],
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        postsCount: user.posts.length,
        totalLikes: likesCount,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error('❌ 填充數據時發生錯誤:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
