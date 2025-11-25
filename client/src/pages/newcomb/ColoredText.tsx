import React from 'react';

// スタイル定義
const styles = {
  give: { color: 'rgb(158, 61, 255)', fontWeight: 'bold' as const, fontSize: '18px' },
  keep: { color: 'rgb(49, 204, 49)', fontWeight: 'bold' as const, fontSize: '18px' },
};

// 複数のコンポーネントをオブジェクトとして定義
export const TextComponents = {
  'give-text': ({ children }: React.PropsWithChildren) => (
    <span style={styles.give}>{children}</span>
  ),
  'keep-text': ({ children }: React.PropsWithChildren) => (
    <span style={styles.keep}>{children}</span>
  ),
};