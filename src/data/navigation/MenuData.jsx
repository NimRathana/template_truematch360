import Chip from '@mui/material/Chip'
import i18n from '@/configs/i18n'
import useAuthStore from '@views/store/useAuthStore'

const getStoredUserType = () => {
  if (typeof window === 'undefined') return null

  const storedUserType = useAuthStore.getState().user_type
  if (storedUserType === null || storedUserType === undefined || storedUserType === '') return null

  const parsedUserType = Number(storedUserType)
  return Number.isNaN(parsedUserType) ? null : parsedUserType
}

const getTranslatedLabel = (item) => {
  const translationKey = item.translationKey || item.labelKey || item.label

  if (!translationKey) return item.label

  const translated = i18n.t(translationKey, { defaultValue: item.label })

  return translated || item.label
}

const translateMenuLabels = (items = []) =>
  items.map((item) => {
    const translatedItem = {
      ...item,
      label: getTranslatedLabel(item),
    }

    if (item.children?.length) {
      translatedItem.children = translateMenuLabels(item.children)
    }

    return translatedItem
  })

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

  return translateMenuLabels(filtered)
}

const baseMenuData = [
  {
    type: 'item',
    label: 'Home',
    translationKey: 'home',
    icon: <i className='ri-home-smile-line' />,
    href: '/',
    allowedUserTypes: [1, 2, 3],
  },
  {
    type: 'item',
    label: 'Dashboard',
    translationKey: 'dashboard',
    icon: <i className='ri-dashboard-line' />,
    href: '/admin/dashboard',
    allowedUserTypes: [1],
  },
  {
    type: 'item',
    label: 'Chat',
    translationKey: 'chat',
    icon: <i className='ri-message-3-line' />,
    href: '/chat',
    allowedUserTypes: [1, 2, 3],
  },

  // ── Admin: Management ──
  {
    type: 'submenu',
    label: 'Management',
    translationKey: 'management',
    icon: <i className='ri-admin-line' />,
    allowedUserTypes: [1],
    children: [
      {
        type: 'item',
        label: 'Users',
        translationKey: 'users',
        href: '/admin/user',
        icon: <i className='ri-group-line' />
      },
      {
        type: 'item',
        label: 'Jobs',
        translationKey: 'jobs',
        href: '/admin/jobs',
        icon: <i className='ri-briefcase-line' />
      },
      {
        type: 'item',
        label: 'Companies',
        translationKey: 'companies',
        href: '/admin/employer',
        icon: <i className='ri-building-line' />
      },
      {
        type: 'item',
        label: 'Candidates',
        translationKey: 'candidates',
        href: '/admin/candidate',
        icon: <i className='ri-user-line' />
      },
      {
        type: 'item',
        label: 'Audit',
        translationKey: 'audit',
        href: '/audit',
        icon: <i className='ri-file-list-3-line' />
      }
    ]
  },

  // ── Admin: Settings ──
  {
    type: 'submenu',
    label: 'Settings',
    translationKey: 'settings',
    icon: <i className='ri-settings-3-line' />,
    allowedUserTypes: [1],
    children: [
      {
        type: 'item',
        label: 'System Parameter',
        translationKey: 'system_parameter',
        href: '/system_parameter',
        icon: <i className='ri-settings-4-line' />
      }
    ]
  },

  // ── Employer ──
  {
    type: 'section',
    label: 'Employer',
    translationKey: 'employer',
    allowedUserTypes: [2],
    children: [
      {
        type: 'item',
        label: 'Applied Candidates',
        translationKey: 'applied_candidates',
        href: '/applied_candidates',
        icon: <i className='ri-user-search-line' />
      },
      {
        type: 'item',
        label: 'Job Posts',
        translationKey: 'job_posts',
        href: '/employer',
        icon: <i className='ri-building-4-line' />
      }
    ]
  },

  // ── Candidate ──
  {
    type: 'section',
    label: 'Candidate',
    translationKey: 'candidate',
    allowedUserTypes: [3],
    children: [
      {
        type: 'item',
        label: 'Update Profile',
        translationKey: 'update_profile',
        href: '/update_profile',
        icon: <i className='ri-user-settings-line' />
      },
      {
        type: 'item',
        label: 'Candidate Apply',
        translationKey: 'candidate_apply',
        href: '/candidate_apply',
        icon: <i className='ri-file-user-line' />
      },
      {
        type: 'submenu',
        label: 'CV Templates',
        translationKey: 'cv_templates',
        icon: <i className='ri-download-line' />,
        children: [
          {
            type: 'item',
            label: 'Blue Sidebar Modern',
            translationKey: 'blue_sidebar_modern',
            href: '#',
            icon: <i className='ri-file-paper-2-line' />
          },
          {
            type: 'item',
            label: 'Sidebar Tech Template',
            translationKey: 'sidebar_tech_template',
            href: '#',
            icon: <i className='ri-file-code-line' />
          },
          {
            type: 'item',
            label: 'Classic Software CV',
            translationKey: 'classic_software_cv',
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
