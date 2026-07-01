import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)
dayjs.locale('ko')

const StringUtil = {
  formatComma: (value: number | string | undefined): string => {
    if (value === null || value === undefined || value === '') return '0'
    const num = Number(String(value).replace(/,/g, ''))
    if (Number.isNaN(num)) return String(value)
    return num.toLocaleString()
  },
  formatDate: (d: Date | string, f: string = 'YYYY-MM-DD') => {
    let now = dayjs(d)
    if (f === 'hh:mm' || f === 'HH:mm') {
      now = dayjs(d).locale('en')
    }
    return now.format(f)
  }
} as const

export default StringUtil
