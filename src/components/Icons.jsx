import React from 'react'

// 1.5px stroke 라인 아이콘 세트 — web-precision-fintech 스펙: 채워진 아이콘·이모지 금지
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function Svg({ size = 18, children, style, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', flexShrink: 0, ...style }} {...base} {...rest}>
      {children}
    </svg>
  )
}

export const CarIcon = (p) => (
  <Svg {...p}>
    <path d="M5 17h14M5 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm14 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0M3 17V11l2-5h14l2 5v6M5 11h14" />
  </Svg>
)

export const MapPinIcon = (p) => (
  <Svg {...p}>
    <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.3" />
  </Svg>
)

export const UsersIcon = (p) => (
  <Svg {...p}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    <path d="M16 4.2a3 3 0 0 1 0 5.8M20.5 20c0-2.8-2-5.1-4.5-5.8" />
  </Svg>
)

export const CalendarIcon = (p) => (
  <Svg {...p}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
    <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" />
  </Svg>
)

export const ClockIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Svg>
)

export const GridIcon = (p) => (
  <Svg {...p}>
    <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.2" />
    <rect x="13" y="3.5" width="7.5" height="7.5" rx="1.2" />
    <rect x="3.5" y="13" width="7.5" height="7.5" rx="1.2" />
    <rect x="13" y="13" width="7.5" height="7.5" rx="1.2" />
  </Svg>
)

export const SearchIcon = (p) => (
  <Svg {...p}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M20 20l-4.35-4.35" />
  </Svg>
)

export const FileTextIcon = (p) => (
  <Svg {...p}>
    <path d="M6 3h8l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
    <path d="M14 3v5h5M8 12h8M8 16h8M8 9h3" />
  </Svg>
)

export const ClipboardIcon = (p) => (
  <Svg {...p}>
    <rect x="5" y="4.5" width="14" height="17" rx="1.5" />
    <rect x="8.5" y="2.5" width="7" height="3.5" rx="1" />
    <path d="M8.5 11.5h7M8.5 15.5h7" />
  </Svg>
)

export const XIcon = (p) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
)

export const CheckIcon = (p) => (
  <Svg {...p}>
    <path d="M4.5 12.5l5 5 10-11" />
  </Svg>
)

export const ChevronRightIcon = (p) => (
  <Svg {...p}>
    <path d="M9 5l7 7-7 7" />
  </Svg>
)

export const ChevronLeftIcon = (p) => (
  <Svg {...p}>
    <path d="M15 5l-7 7 7 7" />
  </Svg>
)

export const ChevronDownIcon = (p) => (
  <Svg {...p}>
    <path d="M5 9l7 7 7-7" />
  </Svg>
)

export const StarIcon = (p) => (
  <Svg {...p}>
    <path d="M12 3.5l2.6 5.5 6 .7-4.4 4.1 1.1 6-5.3-3-5.3 3 1.1-6L3.4 9.7l6-.7L12 3.5Z" />
  </Svg>
)

export const LogOutIcon = (p) => (
  <Svg {...p}>
    <path d="M15 19H6a1.5 1.5 0 0 1-1.5-1.5v-11A1.5 1.5 0 0 1 6 5h9" />
    <path d="M20 12H9.5M20 12l-3.5-3.5M20 12l-3.5 3.5" />
  </Svg>
)

export const UserIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
  </Svg>
)

export const PlusIcon = (p) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
)

export const MessageIcon = (p) => (
  <Svg {...p}>
    <path d="M4 5h16v11H8l-4 4V5Z" />
  </Svg>
)

export const AlertCircleIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 8v5" />
    <circle cx="12" cy="16" r="0.6" fill="currentColor" stroke="none" />
  </Svg>
)

export const TrashIcon = (p) => (
  <Svg {...p}>
    <path d="M4.5 7h15M9 7V4.5h6V7M6.5 7l1 13h9l1-13" />
  </Svg>
)

export const PhoneIcon = (p) => (
  <Svg {...p}>
    <path d="M6 3.5h3l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5l1.5-2 4 1.5v3a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 4.5 5.1 1.5 1.5 0 0 1 6 3.5Z" />
  </Svg>
)

export const MailIcon = (p) => (
  <Svg {...p}>
    <rect x="3.5" y="5" width="17" height="14" rx="1.5" />
    <path d="M4 6.5l8 6.5 8-6.5" />
  </Svg>
)

export const LockIcon = (p) => (
  <Svg {...p}>
    <rect x="5" y="10.5" width="14" height="9" rx="1.5" />
    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
  </Svg>
)

export const MapIcon = (p) => (
  <Svg {...p}>
    <path d="M9 4L4 6v14l5-2 6 2 5-2V4l-5 2-6-2Z" />
    <path d="M9 4v14M15 6v14" />
  </Svg>
)

export const ArrowRightIcon = (p) => (
  <Svg {...p}>
    <path d="M4 12h15M13.5 6.5L19 12l-5.5 5.5" />
  </Svg>
)

export const CoinIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M14 9.2a2.6 2.6 0 0 0-4.4 1.6c0 2.6 4.4 1.4 4.4 4a2.6 2.6 0 0 1-4.4 1.6M12 6.5v11" />
  </Svg>
)

export const CarFrontIcon = CarIcon
