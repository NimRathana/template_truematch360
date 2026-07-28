import useAuthStore from '@views/store/useAuthStore'
import i18n from '@/configs/i18n'

const getStoredUserType = () => {
  if (typeof window === 'undefined') return null

  const storedUserType = useAuthStore.getState().user_type
  if (storedUserType === null || storedUserType === undefined || storedUserType === '') return null

  const parsedUserType = Number(storedUserType)
  return Number.isNaN(parsedUserType) ? null : parsedUserType
}


const filterMenuByUserType = (items, userType) => {
  const isAllowed = (item) => {
    if (!item.allowedUserTypes) return true
    if (userType == null) return false
    return item.allowedUserTypes.includes(userType)
  }

  const filtered = []

  items.forEach(item => {
    if (item.type === 'section') {
      if (!isAllowed(item)) return

      const children = filterMenuByUserType(item.children || [], userType)
      if (children.length) {
        filtered.push({ ...item, children })
      }
    } else if (item.type === 'submenu') {
      if (!isAllowed(item)) return

      const children = filterMenuByUserType(item.children || [], userType)
      if (children.length) {
        filtered.push({ ...item, children })
      }
    } else if (isAllowed(item)) {
      filtered.push(item)
    }
  })

  return filtered
}

const baseMenuData = [
  {
    type: 'item',
    label: 'home',
    icon: <i className='ri-home-smile-line' />,
    href: '/',
    allowedUserTypes: [1, 2, 3],
  },
  {
    type: 'item',
    label: 'dashboard',
    icon: <i className='ri-dashboard-line' />,
    href: '/admin/dashboard',
    allowedUserTypes: [1],
  },
  {
    type: 'item',
    label: 'chat',
    icon: <i className='ri-message-3-line' />,
    href: '/chat',
    allowedUserTypes: [1, 2, 3],
  },

  // ── Admin: Management ──
  {
    type: 'submenu',
    label: 'management',
    icon: <i className='ri-admin-line' />,
    allowedUserTypes: [1],
    children: [
      {
        type: 'item',
        label: 'users',
        href: '/admin/user',
        icon: <i className='ri-group-line' />
      },
      {
        type: 'item',
        label: 'jobs',
        href: '/admin/jobs',
        icon: <i className='ri-briefcase-line' />
      },
      {
        type: 'item',
        label: 'companies',
        href: '/admin/employer',
        icon: <i className='ri-building-line' />
      },
      {
        type: 'item',
        label: 'candidates',
        href: '/admin/candidate',
        icon: <i className='ri-user-line' />
      },
      {
        type: 'item',
        label: 'audit',
        href: '/audit',
        icon: <i className='ri-file-list-3-line' />
      }
    ]
  },


  // ── Admin: Settings ──
  {
    type: 'submenu',
    label: 'settings',
    icon: <i className='ri-settings-3-line' />,
    allowedUserTypes: [1],
    children: [
      {
        type: 'item',
        label: 'system_parameter',
        href: '/system_parameter',
        icon: <i className='ri-settings-4-line' />
      }
    ]
  },

  // ── Employer ──
  {
    type: 'section',
    label: 'employer',
    allowedUserTypes: [2],
    children: [
      {
        type: 'item',
        label: 'applied_candidates',
        href: '/applied_candidates',
        icon: <i className='ri-user-search-line' />
      },
      {
        type: 'item',
        label: 'job_posts',
        href: '/employer',
        icon: <i className='ri-building-4-line' />
      }
    ]
  },


  // ── Candidate ──
  {
    type: 'section',
    label: 'candidate',
    allowedUserTypes: [3],
    children: [
      {
        type: 'item',
        label: 'update_profile',
        href: '/update_profile',
        icon: <i className='ri-user-settings-line' />
      },
      {
        type: 'item',
        label: 'candidate_apply',
        href: '/candidate_apply',
        icon: <i className='ri-file-user-line' />
      },
      {
        type: 'submenu',
        label: 'cv_templates',
        icon: <i className='ri-download-line' />,
        children: [
          {
            type: 'item',
            label: 'blue_sidebar_modern',
            href: '#',
            icon: <i className='ri-file-paper-2-line' />
          },
          {
            type: 'item',
            label: 'sidebar_tech_template',
            href: '#',
            icon: <i className='ri-file-code-line' />
          },
          {
            type: 'item',
            label: 'classic_software_cv',
            href: '#',
            icon: <i className='ri-file-text-line' />
          }
        ]
      }
    ]
  }
]

export const getMenuDataForUser = (userType = getStoredUserType()) => filterMenuByUserType(baseMenuData, userType)

const createDynamicMenuArray = () => {
  const getCurrentItems = () => getMenuDataForUser(getStoredUserType())

  return new Proxy([], {
    get(target, prop, receiver) {
      const currentItems = getCurrentItems()

      if (prop === Symbol.iterator) return currentItems[Symbol.iterator].bind(currentItems)
      if (prop === 'length') return currentItems.length
      if (prop === 'map') return currentItems.map.bind(currentItems)
      if (prop === 'forEach') return currentItems.forEach.bind(currentItems)
      if (prop === 'filter') return currentItems.filter.bind(currentItems)
      if (prop === 'reduce') return currentItems.reduce.bind(currentItems)
      if (prop === 'slice') return currentItems.slice.bind(currentItems)
      if (prop === 'find') return currentItems.find.bind(currentItems)
      if (prop === 'some') return currentItems.some.bind(currentItems)
      if (prop === 'every') return currentItems.every.bind(currentItems)

      return Reflect.get(currentItems, prop, receiver)
    }
  })
}

const createDynamicRoleMap = () => {
  const getCurrentMap = () => ({
    guest: getMenuDataForUser(null),
    1: getMenuDataForUser(1),
    2: getMenuDataForUser(2),
    3: getMenuDataForUser(3)
  })

  return new Proxy({}, {
    get(target, prop, receiver) {
      const currentMap = getCurrentMap()
      if (prop in currentMap) return currentMap[prop]
      return Reflect.get(target, prop, receiver)
    }
  })
}

export const MenuData = createDynamicMenuArray()

export const MenuDataByRole = createDynamicRoleMap()

// Helper: translate labels at render time using the i18n 't' function.
// Call this from components so translations update immediately when language changes.
export const translateMenuLabels = (items = [], t) => {
  if (!t || typeof t !== 'function') return items

  return items.map(item => {
    const translated = { ...item, label: t(item.label) }
    if (item.children && Array.isArray(item.children)) {
      translated.children = translateMenuLabels(item.children, t)
    }
    return translated
  })
}

// Convenience: get translated menu for current user
export const getTranslatedMenuForUser = (t, userType = getStoredUserType()) => {
  const items = getMenuDataForUser(userType)
  return translateMenuLabels(items, t)
}
