export default {
  menu: {
    devTools: {
      title: '開発ツール',
      qrcode: 'QRコード',
      codec: 'エンコード',
      time: '時間',
      json: 'JSON'
    },
    lifeTools: {
      title: '生活ツール',
      light: '写真ライト'
    },
    workTools: {
      title: '作業ツール',
      text: 'テキストツール'
    },
    about: 'について'
  },
  common: {
    search: '検索...',
    starred: 'お気に入り',
    toolbox: 'ツールボックス',
    confirmUnstar: 'お気に入りを解除',
    cancel: 'キャンセル',
    advertisement: '広告',
    copy: "コピー",
    copied: "コピーしました！",
    reset: "リセット",
    confirmTitle: "確認",
    confirmReset: "リセット確認",
    displayMode: {
      compact: 'コンパクトモード',
      fullscreen: '全画面モード'
    }
  },
  qrcode: {
    placeholder: '変換するテキストを入力...',
    save: 'QRコード生成',
    reset: 'リセット',
    history: '履歴',
    clearAll: 'すべて削除',
    copy: 'テキストをコピー',
    delete: '削除',
    incognito: 'シークレットモード',
    download: 'ダウンロード',
    confirmReset: 'リセット確認',
    confirmClear: '削除確認',
    showMore: 'もっと見る ({count})',
    showLess: '折りたたむ',
    confirmEdit: '編集を確認',
    copyTitle: 'テキストをコピー',
    editTitle: '編集',
    deleteTitle: '削除',
    confirmDelete: '削除を確認',
    copySuccess: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    title: 'QRコードツール',
    encodeTab: 'QRコード生成',
    decodeTab: 'QRコード読み取り',
    selectImage: '画像を選択',
    dragTip: 'または画像をここにドロップ',
    decodedResult: '読み取り結果',
    decodeError: 'QRコードを読み取れません',
    invalidImageFile: '画像ファイルをアップロードしてください',
    downloadError: 'ダウンロードに失敗しました。もう一度お試しください',
    zoom: 'ズームモード'
  },
  codec: {
    url: 'URLエンコード/デコード',
    base64: 'Base64エンコード/デコード',
    input: 'テキストを入力...',
    output: '出力結果',
    inputLabel: '入力',
    outputLabel: '出力',
    encode: 'エンコード',
    decode: 'デコード',
    copy: 'コピー',
    reset: 'リセット',
    confirmReset: 'リセット確認',
    cancel: 'キャンセル',
    copySuccess: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    title: 'エンコードツール'
  },
  time: {
    timestampConverter: 'タイムスタンプ変換',
    timestampToDate: 'タイムスタンプから日時',
    dateToTimestamp: '日時からタイムスタンプ',
    inputTimestamp: '入力',
    outputDate: '出力日時',
    outputTimestamp: '出力',
    isMilliseconds: 'ミリ秒タイムスタンプ',
    year: '年',
    month: '月', 
    day: '日',
    hour: '時',
    minute: '分',
    second: '秒',
    millisecond: 'ミリ秒',
    milliseconds: 'ミリ秒',
    seconds: '秒',
    copy: 'コピー',
    reset: 'リセット',
    confirmReset: 'リセット確認',
    copySuccess: 'コピーしまた',
    copyFailed: 'コピーに失敗しました',
    title: '時間ツール',
    refresh: '現在時刻を更新',
    inputDate: '日付入力'
  },
  json: {
    format: 'JSON フォーマット',
    title: 'JSON ツール',
    inputLabel: '入力',
    outputLabel: '出力',
    compress: '圧縮モード',
    reset: 'リセット',
    confirmReset: 'リセット確認',
    cancel: 'キャンセル',
    diff: 'JSON 比較',
    diffLegend: '凡例',
    removed: '削除',
    added: '追加',
    invalidJson: '無効な JSON 形式',
    copy: 'コピー',
    copySuccess: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    copyError: 'コピーに失敗しました'
  },
  light: {
    title: '写真ライト',
    brightness: '明るさ',
    favorite: 'お気に入り',
    camera: {
      mirror: 'ミラー',
      takePhoto: '撮影',
      photoSuccess: '写真を保存しました',
      photoFailed: '撮影に失敗しました。もう一度お試しください',
      permissionDenied: 'カメラの使用が許可されていません'
    }
  },
  text: {
    title: 'テキストツール',
    input: '入力テキスト',
    output: '出力結果',
    functions: {
      trim: '空白削除',
      uppercase: '大文字に変換',
      lowercase: '小文字に変換',
      reverse: 'テキスト反転',
      length: '文字数カウント'
    },
    copy: 'コピー',
    reset: 'リセット',
    cancel: 'キャンセル',
    confirmReset: 'リセット確認',
    copySuccess: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    replace: {
      title: 'テキスト置換',
      input: '入力テキスト',
      inputPlaceholder: '処理するテキストを入力...',
      from: '検索',
      fromPlaceholder: '検索するテキスト',
      to: '置換後',
      toPlaceholder: '置換後のテキスト',
      execute: '置換',
      regex: '正規表現',
      newline: '改行',
      quote: '引用符',
      regexMode: '正規表現モード',
      error: '置換に失敗しました。入力を確認してください',
      number: '数字',
      letter: 'アルファベット',
      noMatch: '一致する内容が見つかりません'
    }
  },
  about: {
    title: 'MoreTools について',
    projectInfo: {
      title: 'プロジェクト紹介',
      description: 'MoreToolsは、Cursorをベースに開発されたオンラインツールボックスで、様々な実用的な開発ツールと生活ツールを統合し、ダークモードと国際化をサポートしています。ご利用ありがとうございます。GitHub Issuesでのフィードバックやご提案もお待ちしております。',
      github: 'GitHubリポジトリ',
      issues: 'GitHub Issues フィードバック'
    },
    author: {
      title: '作者について',
      description: '私はkingcosです。開発者/クリエイターとして、自分の創造性とコードで世界に変化をもたらしたいと考えています :D',
      social: {
        github: 'GitHub',
        weibo: 'Weibo',
        wechat: 'WeChat',
        xiaohongshu: 'Xiaohongshu',
        blog: 'ブログ',
        more: 'もっと詳しく'
      }
    },
    reward: {
      title: 'サポート'
    }
  }
}