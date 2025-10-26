import { useEffect, useRef } from 'react';

interface ChangeInfo {
  component: string;
  changeType: 'created' | 'updated' | 'deleted';
  description: string;
}

export function useDocumentationCheck() {
  const changes = useRef<ChangeInfo[]>([]);

  const addChange = (change: ChangeInfo) => {
    changes.current.push(change);
  };

  const checkForUnloggedChanges = () => {
    if (changes.current.length > 0) {
      console.warn('警告：有未記錄的更改！');
      console.table(changes.current);
      return false;
    }
    return true;
  };

  useEffect(() => {
    // 當組件卸載時檢查是否有未記錄的更改
    return () => {
      checkForUnloggedChanges();
    };
  }, []);

  return {
    addChange,
    checkForUnloggedChanges,
  };
}

// 使用示例：
/*
function MyComponent() {
  const { addChange } = useDocumentationCheck();

  const handleSomeChange = () => {
    // 執行更改
    // ...

    // 記錄更改
    addChange({
      component: 'MyComponent',
      changeType: 'updated',
      description: '更新了某功能'
    });
  };

  return <View>...</View>;
}
*/