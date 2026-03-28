export default {
  menu: {
    devTools: {
      title: '开发工具',
      qrcode: '二维码',
      codec: '编解码',
      time: '时间',
      json: 'JSON'
    },
    lifeTools: {
      title: '生活必备',
      light: '拍照补光灯'
    },
    workTools: {
      title: '工作常用',
      text: '文本处理'
    },
    about: '关于'
  },
  common: {
    search: '搜索...',
    starred: '收藏',
    toolbox: '工具箱',
    confirmUnstar: '确认取消收藏',
    cancel: '取消',
    advertisement: '广告',
    copy: "复制",
    copied: "已复制！",
    reset: "重置",
    confirmTitle: "确认",
    confirmReset: "确定重置",
    displayMode: {
      compact: '紧凑模式',
      fullscreen: '全屏模式'
    }
  },
  qrcode: {
    title: '二维码工具',
    encodeTab: '二维码转换',
    decodeTab: '二维码解析',
    selectImage: '选择图片',
    dragTip: '或将图片拖放到此处',
    decodedResult: '解析结果',
    decodeError: '无法解析二维码',
    invalidImageFile: '请上传图片文件',
    downloadError: '下载失败，请重试',
    placeholder: '请输入要转换的文本...',
    save: '生成二维码',
    reset: '重置',
    cancel: '取消',
    history: '历史记录',
    clearAll: '清空全部',
    copy: '复制文本',
    delete: '删除',
    incognito: '无痕模式',
    download: '下载',
    confirmReset: '确认重置',
    confirmClear: '确认清空',
    showMore: '展开更多 ({count})',
    showLess: '收起',
    confirmEdit: '确认编辑',
    copyTitle: '复制文本',
    editTitle: '编辑',
    deleteTitle: '删除',
    confirmDelete: '确认删除',
    copySuccess: '复制成功',
    copyFailed: '复制失败',
    zoom: '放大模式'
  },
  codec: {
    url: 'URL 编解码',
    base64: 'Base64 编解码',
    input: '输入文本...',
    output: '输出结果',
    inputLabel: '输入',
    outputLabel: '输出',
    encode: '编码',
    decode: '解码',
    copy: '复制',
    reset: '重置',
    confirmReset: '确定重置',
    cancel: '取消',
    copySuccess: '复制成功',
    copyFailed: '复制失败',
    title: '编解码工具'
  },
  time: {
    title: '时间工具',
    timestampConverter: '时间戳转换',
    timestampToDate: '时间戳转日期',
    dateToTimestamp: '日期转时间戳',
    inputTimestamp: '输入时间戳',
    inputDate: '输入日期',
    outputDate: '输出日期',
    outputTimestamp: '输出时间戳',
    refresh: '刷新当前时间',
    isMilliseconds: '毫秒时间戳',
    year: '年',
    month: '月', 
    day: '日',
    hour: '时',
    minute: '分',
    second: '秒',
    millisecond: '毫秒',
    milliseconds: '毫秒',
    seconds: '秒',
    copy: '复制',
    reset: '重置',
    cancel: '取消',
    confirmReset: '确认重置',
    copySuccess: '复制成功',
    copyFailed: '复制失败'
  },
  json: {
    format: 'JSON 格式化',
    title: 'JSON 工具',
    inputLabel: '输入',
    outputLabel: '输出',
    compress: '压缩模式',
    reset: '重置',
    confirmReset: '确定重置',
    cancel: '取消',
    diff: 'JSON 对比',
    diffLegend: '图例',
    removed: '删除',
    added: '新增',
    invalidJson: '无效的 JSON 格式',
    copy: '复制',
    copySuccess: '复制成功',
    copyFailed: '复制失败',
    copyError: '复制失败'
  },
  light: {
    title: '拍照补光灯',
    brightness: '亮度',
    favorite: '收藏',
    camera: {
      mirror: '镜像',
      takePhoto: '拍照',
      photoSuccess: '拍照成功，照片已开始下载',
      photoFailed: '拍照失败，请重试',
      permissionDenied: '相机权限被拒绝'
    }
  },
  text: {
    title: '文本处理',
    input: '输入文本',
    output: '输出结果',
    functions: {
      trim: '去除空格',
      uppercase: '转大写',
      lowercase: '转小写',
      reverse: '反转文本',
      length: '字符统计'
    },
    copy: '复制',
    reset: '重置',
    cancel: '取消',
    confirmReset: '确认重置',
    copySuccess: '复制成功',
    copyFailed: '复制失败',
    replace: {
      title: '字符替换',
      input: '输入文本',
      inputPlaceholder: '请输入要处理的文本...',
      from: '查找内容',
      fromPlaceholder: '要替换的文本',
      to: '替换为',
      toPlaceholder: '替换后的文本',
      execute: '执行替换',
      regex: '正则',
      newline: '换行符',
      quote: '引号',
      regexMode: '正则模式',
      error: '替换失败，请检查输入',
      number: '数字',
      letter: '英文',
      noMatch: '未找到匹配内容'
    }
  },
  about: {
    title: '关于 MoreTools',
    tools: {
      qrcode: {
        title: '二维码工具',
        description: '快速生成和解析二维码，支持历史记录和无痕模式，可以轻松处理各类二维码需求'
      },
      codec: {
        title: '编解码工具',
        description: '支持 URL 编解码和 Base64 编解码，为开发者提供便捷的编码转换功能'
      },
      time: {
        title: '时间工具',
        description: '时间戳与日期的互相转换，支持毫秒级时间戳，方便开发调试和日常使用'
      },
      json: {
        title: 'JSON 工具',
        description: 'JSON 格式化、压缩和对比工具，帮助开发者更好地处理 JSON 数据'
      },
      light: {
        title: '拍照补光灯',
        description: '提供屏幕补光功能，支持亮度调节和镜像模式，让自拍更出色'
      },
      text: {
        title: '文本处理',
        description: '提供字符替换、正则匹配等文本处理功能，支持换行符替换和引号包裹等特殊处理'
      }
    },
    projectInfo: {
      title: '项目介绍',
      description: 'MoreTools 是基于 Cursor 开发的在线工具箱，集成了多种实用的开发和生活工具，并支持深色模式和国际化。非常感谢您的体验，也欢迎您在 GitHub Issues 中反馈或建议。',
      github: 'GitHub 仓库',
      issues: 'GitHub Issues 反馈或建议'
    },
    author: {
      title: '关于作者',
      description: '我是 kingcos，一名开发者/创作者，希望用自己的创意和代码为世界带来一些改变 :D',
      social: {
        github: 'GitHub',
        weibo: '微博',
        wechat: '微信公众号',
        xiaohongshu: '小红书',
        blog: '博客',
        more: '关于更多'
      }
    },
    reward: {
      title: '赞赏支持'
    }
  }
}
