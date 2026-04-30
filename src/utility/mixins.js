import moment from 'moment'
import tweetsAPI from '../apis/tweets'
import { Toast } from './helpers'

moment.locale('zh-tw')

export const fromNowFilter = {
  filters: {
    fromNow(datetime) {
      if (!datetime) return '-'
      return moment(datetime).fromNow()
    },
    date(datetime) {
      if (!datetime) return '-'
      return moment(datetime).format('LLLL')
    }
  }
}

export const emptyImageFilter = {
  filters: {
    emptyImage(src) {
      return src || 'https://d29fhpw069ctt2.cloudfront.net/icon/image/84587/preview.svg'
    },
    emptyCover(src) {
      return src || 'https://via.placeholder.com/1000x1000/DFDFDF?text=No+Image'
    }
  }
}

// ── 回覆推文 Modal 共用 mixin（AllTweets / UserTweets / UserLikesTweets）──
const defaultTweetInfo = () => ({
  id: -1,
  UserId: -1,
  description: '',
  createdAt: '',
  updatedAt: '',
  Likes: -1,
  Replies: -1,
  User: {
    id: -1,
    email: '',
    password: '',
    name: '',
    role: '',
    account: '',
    cover: '',
    avatar: '',
    introduction: '',
    createdAt: '',
    updatedAt: ''
  },
  isLiked: false
})

export const replyTweetModalMixin = {
  data() {
    return {
      replyTweetModalIsOpen: false,
      replyTweetModalTweetInfo: defaultTweetInfo(),
      replyText: '',
      isProcessing: false
    }
  },
  methods: {
    async openReplyTweetModal(id) {
      try {
        this.isProcessing = true
        const { data } = await tweetsAPI.getTweet({ id })
        this.replyTweetModalTweetInfo = data
        this.replyTweetModalIsOpen = true
        this.isProcessing = false
      } catch (error) {
        this.isProcessing = false
        Toast.fire({ icon: 'error', title: '推文資料取得失敗' })
      }
    },
    closeReplyTweetModal() {
      this.isProcessing = true
      this.replyTweetModalTweetInfo = defaultTweetInfo()
      this.replyTweetModalIsOpen = false
      this.replyText = ''
      this.isProcessing = false
    },
    async replyTweetModalSubmit() {
      try {
        if (!this.replyText.trim()) {
          Toast.fire({ icon: 'warning', title: '回覆內容不可留白' })
          this.replyText = ''
          return
        } else if (this.replyText.length > 140) {
          Toast.fire({ icon: 'warning', title: '回覆內容不可超過140字' })
          return
        }
        this.isProcessing = true
        await tweetsAPI.replyTweet({
          id: this.replyTweetModalTweetInfo.id,
          comment: this.replyText
        })
        Toast.fire({ icon: 'success', title: '回覆推文成功' })
        this.replyText = ''
        this.replyTweetModalIsOpen = false
        this.isProcessing = false
        this.$router.go(0)
      } catch (error) {
        this.isProcessing = false
        Toast.fire({ icon: 'error', title: '回復推文失敗' })
      }
    }
  }
}

// ── 聊天室時間格式化 mixin（PublicChat / PrivateMessages）──
export const chatTimeMixin = {
  methods: {
    formatTime(ts) {
      if (!ts) return ''
      const d = new Date(ts)
      const h = d.getHours()
      const m = String(d.getMinutes()).padStart(2, '0')
      return `${h >= 12 ? '下午' : '上午'}${h > 12 ? h - 12 : h}:${m}`
    },
    formatTimeShort(ts) {
      if (!ts) return ''
      const d = new Date(ts)
      const now = new Date()
      const diffMins = Math.floor((now - d) / 60000)
      if (diffMins < 1) return '剛剛'
      if (diffMins < 60) return `${diffMins} 分鐘`
      const diffHrs = Math.floor(diffMins / 60)
      if (diffHrs < 24) return `${diffHrs} 小時`
      return `${d.getMonth() + 1}月${d.getDate()}日`
    }
  }
}

// ── 通知類型文字 mixin（Notifications.vue）──
export const notificationTextMixin = {
  methods: {
    getNotificationText(type) {
      const typeMap = {
        new_tweet: '發布了新推文',
        new_follower: '開始追蹤你',
        new_reply: '回覆了你的推文',
        new_like: '喜歡你的推文'
      }
      return typeMap[type] || ''
    }
  }
}