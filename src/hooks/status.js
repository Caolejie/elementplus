let statusMap = {
  'unpaid': {
    text: '待支付',
    color: '#E13E93'
  },
  'cancel': {
    text: '已取消',
    color: ''
  },
  'paid': {
    text: '已支付',
    color: ''
  },
  'send': {
    text: '配送中',
    color: '#7326E9'
  },
  'completed': {
    text: '已完成',
    color: '#283839'
  },
  'invoice': {
    text: '已开票',
    color: ''
  },
  'wait_evaluation': {
    text: '待评价',
    color: ''
  },
  'evaluated': {
    text: '已评价',
    color: ''
  },
  'wait': {
    text: '待审核',
    color: ''
  },
  'rejected': {
    text: '审核失败',
    color: ''
  },
  'no_start': {
    text: '待开始',
    color: '#7326E9'
  },
  'conduct': {
    text: '进行中',
    color: ''
  },
  'in_finish': {
    text: '已选礼',
    color: '#7326E9'
  },
  'apply_refund': {
    text: '申请退款',
    color: ''
  },
  'refunding': {
    text: '退款中',
    color: ''
  },
  'refunded': {
    text: '退款完成',
    color: ''
  },
}

export default function getStatusText(status) {
  return statusMap[status]?.text ?? status
}

export function getStatusColor(status) {
  return statusMap[status]?.color || ''
}