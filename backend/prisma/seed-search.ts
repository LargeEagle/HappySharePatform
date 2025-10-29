// HAPPY SHARE - 搜尋功能測試數據填充
// 此腳本為搜尋功能添加測試數據：標籤、附件、搜尋歷史

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedTags() {
  console.log('🏷️  開始填充標籤數據...');

  const tags = [
    { 
      name: '旅遊', 
      slug: 'travel', 
      description: '分享旅遊經歷、景點推薦和旅行攻略' 
    },
    { 
      name: '美食', 
      slug: 'food', 
      description: '美食推薦、烹飪分享和餐廳評價' 
    },
    { 
      name: '科技', 
      slug: 'tech', 
      description: '科技新聞、產品評測和技術分享' 
    },
    { 
      name: '生活', 
      slug: 'lifestyle', 
      description: '日常生活分享和生活小技巧' 
    },
    { 
      name: '攝影', 
      slug: 'photography', 
      description: '攝影作品分享和拍攝技巧' 
    },
    { 
      name: '運動', 
      slug: 'sports', 
      description: '運動健身、比賽分享和健康生活' 
    },
    { 
      name: '音樂', 
      slug: 'music', 
      description: '音樂推薦、演唱會分享和音樂評論' 
    },
    { 
      name: '電影', 
      slug: 'movies', 
      description: '電影評論、影評分享和觀影推薦' 
    },
    { 
      name: '閱讀', 
      slug: 'reading', 
      description: '書籍推薦、讀書心得和文學分享' 
    },
    { 
      name: '時尚', 
      slug: 'fashion', 
      description: '時尚穿搭、美妝分享和潮流資訊' 
    },
  ];

  let createdCount = 0;
  let existingCount = 0;

  for (const tagData of tags) {
    try {
      await prisma.tag.upsert({
        where: { slug: tagData.slug },
        update: {},
        create: tagData,
      });
      createdCount++;
    } catch (error) {
      existingCount++;
    }
  }

  console.log(`   ✅ 創建了 ${createdCount} 個新標籤`);
  if (existingCount > 0) {
    console.log(`   ℹ️  跳過了 ${existingCount} 個已存在的標籤`);
  }
}

async function seedPostTags() {
  console.log('🔗 開始為文章分配標籤...');

  const posts = await prisma.post.findMany({
    select: { id: true, title: true },
  });

  const tags = await prisma.tag.findMany({
    select: { id: true, name: true },
  });

  if (posts.length === 0) {
    console.log('   ⚠️  沒有找到文章，跳過標籤分配');
    return;
  }

  if (tags.length === 0) {
    console.log('   ⚠️  沒有找到標籤，跳過標籤分配');
    return;
  }

  let assignedCount = 0;

  for (const post of posts) {
    // 為每篇文章隨機分配 1-3 個標籤
    const numTags = Math.floor(Math.random() * 3) + 1;
    const selectedTags = [...tags]
      .sort(() => 0.5 - Math.random())
      .slice(0, numTags);

    for (const tag of selectedTags) {
      try {
        await prisma.postTag.upsert({
          where: {
            postId_tagId: {
              postId: post.id,
              tagId: tag.id,
            },
          },
          update: {},
          create: {
            postId: post.id,
            tagId: tag.id,
          },
        });
        assignedCount++;

        // 更新標籤的文章計數
        await prisma.tag.update({
          where: { id: tag.id },
          data: {
            postsCount: {
              increment: 1,
            },
          },
        });
      } catch (error) {
        // 忽略重複的標籤分配
      }
    }
  }

  console.log(`   ✅ 分配了 ${assignedCount} 個文章-標籤關聯`);
}

async function seedAttachments() {
  console.log('📎 開始填充附件數據...');

  const posts = await prisma.post.findMany({
    select: { id: true, authorId: true, title: true },
    take: 5, // 只為前 5 篇文章添加附件
  });

  if (posts.length === 0) {
    console.log('   ⚠️  沒有找到文章，跳過附件添加');
    return;
  }

  const attachments = [
    {
      filename: 'travel-guide-2024.pdf',
      originalName: '2024旅遊攻略.pdf',
      mimeType: 'application/pdf',
      size: 2048000,
    },
    {
      filename: 'recipe-collection.pdf',
      originalName: '美食食譜合集.pdf',
      mimeType: 'application/pdf',
      size: 1536000,
    },
    {
      filename: 'tech-report.docx',
      originalName: '科技報告.docx',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      size: 512000,
    },
    {
      filename: 'photo-album.zip',
      originalName: '照片集.zip',
      mimeType: 'application/zip',
      size: 10240000,
    },
    {
      filename: 'presentation.pptx',
      originalName: '分享簡報.pptx',
      mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      size: 3072000,
    },
  ];

  let createdCount = 0;

  for (let i = 0; i < Math.min(posts.length, attachments.length); i++) {
    const post = posts[i];
    const attachment = attachments[i];

    try {
      await prisma.attachment.create({
        data: {
          ...attachment,
          url: `/uploads/${attachment.filename}`,
          postId: post.id,
          uploaderId: post.authorId,
        },
      });
      createdCount++;
    } catch (error) {
      console.error(`   ❌ 創建附件失敗: ${error.message}`);
    }
  }

  console.log(`   ✅ 創建了 ${createdCount} 個附件`);
}

async function seedSearchHistory() {
  console.log('🔍 開始填充搜尋歷史數據...');

  const users = await prisma.user.findMany({
    select: { id: true },
    take: 3, // 只為前 3 個用戶添加搜尋歷史
  });

  if (users.length === 0) {
    console.log('   ⚠️  沒有找到用戶，跳過搜尋歷史添加');
    return;
  }

  const searchQueries = [
    { query: '旅遊', type: 'tags' },
    { query: '美食推薦', type: 'posts' },
    { query: 'Alice', type: 'users' },
    { query: '攻略', type: 'files' },
    { query: '科技', type: 'all' },
    { query: '照片', type: 'files' },
    { query: '音樂', type: 'tags' },
    { query: 'Bob', type: 'users' },
    { query: '分享', type: 'posts' },
  ];

  let createdCount = 0;

  for (const user of users) {
    // 為每個用戶隨機添加 2-4 條搜尋歷史
    const numQueries = Math.floor(Math.random() * 3) + 2;
    const selectedQueries = [...searchQueries]
      .sort(() => 0.5 - Math.random())
      .slice(0, numQueries);

    for (const queryData of selectedQueries) {
      try {
        await prisma.searchHistory.create({
          data: {
            userId: user.id,
            query: queryData.query,
            type: queryData.type,
          },
        });
        createdCount++;
      } catch (error) {
        console.error(`   ❌ 創建搜尋歷史失敗: ${error.message}`);
      }
    }
  }

  console.log(`   ✅ 創建了 ${createdCount} 條搜尋歷史`);
}

async function main() {
  console.log('🚀 開始填充搜尋功能測試數據...\n');

  try {
    await seedTags();
    await seedPostTags();
    await seedAttachments();
    await seedSearchHistory();

    console.log('\n✨ 搜尋功能測試數據填充完成！');
    
    // 顯示統計信息
    const stats = await Promise.all([
      prisma.tag.count(),
      prisma.postTag.count(),
      prisma.attachment.count(),
      prisma.searchHistory.count(),
    ]);

    console.log('\n📊 數據統計：');
    console.log(`   - 標籤總數: ${stats[0]}`);
    console.log(`   - 文章-標籤關聯: ${stats[1]}`);
    console.log(`   - 附件總數: ${stats[2]}`);
    console.log(`   - 搜尋歷史: ${stats[3]}`);

  } catch (error) {
    console.error('\n❌ 填充過程中發生錯誤:', error);
    throw error;
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
