import Chip from '@mui/material/Chip'

export const MenuData = [
  // ── Common ──
  {
    type: 'item',
    label: 'Home',
    icon: <i className='ri-home-smile-line' />,
    href: '/'
  },
  {
    type: 'item',
    label: 'Dashboard',
    icon: <i className='ri-dashboard-line' />,
    href: '/admin/dashboard'
  },
  {
    type: 'item',
    label: 'Chat',
    icon: <i className='ri-message-3-line' />,
    href: '/chat'
    // You can add a badge later: suffix: <Chip label={unread} size='small' color='error' />
  },

  // ── Admin: Management ──
  {
    type: 'submenu',
    label: 'Management',
    icon: <i className='ri-admin-line' />,
    children: [
      {
        type: 'item',
        label: 'Users',
        href: '/admin/user',
        icon: <i className='ri-group-line' />
      },
      {
        type: 'item',
        label: 'Jobs',
        href: '/admin/jobs',
        icon: <i className='ri-briefcase-line' />
      },
      {
        type: 'item',
        label: 'Companies',
        href: '/admin/employer',
        icon: <i className='ri-building-line' />
      },
      {
        type: 'item',
        label: 'Candidates',
        href: '/admin/candidate',
        icon: <i className='ri-user-line' />
      },
      {
        type: 'item',
        label: 'Audit',
        href: '/audit',
        icon: <i className='ri-file-list-3-line' />
      },
      {
        type: 'item',
        label: 'System Parameters',
        href: '/system_parameters',
        icon: <i className='ri-settings-3-line' />
      }
    ]
  },

  // ── Admin: Settings ──
  {
    type: 'submenu',
    label: 'Settings',
    icon: <i className='ri-settings-3-line' />,
    children: [
      {
        type: 'item',
        label: 'System Parameter',
        href: '/system_parameter',
        icon: <i className='ri-settings-4-line' />
      }
    ]
  },

  // ── Employer ──
  // {
  //   type: 'section',
  //   label: 'Employer',
  //   children: [
  //     {
  //       type: 'item',
  //       label: 'Applied Candidates',
  //       href: '/applied_candidates',
  //       icon: <i className='ri-user-search-line' />
  //     },
  //     {
  //       type: 'item',
  //       label: 'Job Posts',
  //       href: '/employer',
  //       icon: <i className='ri-building-4-line' />
  //     }
  //   ]
  // },

  // ── Candidate ──
  // {
  //   type: 'section',
  //   label: 'Candidate',
  //   children: [
  //     {
  //       type: 'item',
  //       label: 'Update Profile',
  //       href: '/update_profile',
  //       icon: <i className='ri-user-settings-line' />
  //     },
  //     {
  //       type: 'item',
  //       label: 'Candidate Apply',
  //       href: '/candidate_apply',
  //       icon: <i className='ri-file-user-line' />
  //     },
  //     {
  //       type: 'submenu',
  //       label: 'CV Templates',
  //       icon: <i className='ri-download-line' />,
  //       children: [
  //         {
  //           type: 'item',
  //           label: 'Blue Sidebar Modern',
  //           href: '#', // or keep as action, handle in menu click
  //           icon: <i className='ri-file-paper-2-line' />
  //         },
  //         {
  //           type: 'item',
  //           label: 'Sidebar Tech Template',
  //           href: '#',
  //           icon: <i className='ri-file-code-line' />
  //         },
  //         {
  //           type: 'item',
  //           label: 'Classic Software CV',
  //           href: '#',
  //           icon: <i className='ri-file-text-line' />
  //         }
  //       ]
  //     }
  //   ]
  // }
]

// export const MenuData = [
//   {
//     type: 'item',
//     label: 'Dashboard',
//     icon: <i className='ri-home-smile-line' />,
//     href: '/'
//   },
//   {
//     type: 'section',
//     label: 'Apps & Pages',
//     children: [
//       {
//         type: 'item',
//         label: 'Account Settings',
//         href: '/account-settings',
//         icon: <i className='ri-user-settings-line' />
//       },
//       {
//         type: 'submenu',
//         label: 'Auth Pages',
//         icon: <i className='ri-shield-keyhole-line' />,
//         children: [
//           { icon: <i className='ri-login-box-line' />, type: 'item', label: 'Login', href: '/login', target: '_blank' },
//           { icon: <i className='ri-user-add-line' />, type: 'item', label: 'Register', href: '/register', target: '_blank' },
//           { icon: <i className='ri-lock-password-line' />, type: 'item', label: 'Forgot Password', href: '/forgot-password', target: '_blank' }
//         ]
//       },
//       {
//         type: 'item',
//         label: 'Cards',
//         href: '/card-basic',
//         icon: <i className='ri-bar-chart-box-line' />
//       }
//     ]
//   },
//   {
//     type: 'section',
//     label: 'Forms & Tables',
//     children: [
//       {
//         type: 'item',
//         label: 'Form Layouts',
//         href: '/form-layouts',
//         icon: <i className='ri-layout-4-line' />
//       },
//       {
//         type: 'submenu',
//         label: 'Others',
//         icon: <i className='ri-more-line' />,
//         children: [
//           {
//             icon: <i className='ri-file-list-3-line' />,
//             type: 'item',
//             label: 'Item With Badge',
//             suffix: <Chip label='New' size='small' color='info' />
//           },
//           {
//             icon: <i className='ri-external-link-line' />,
//             type: 'item',
//             label: 'External Link',
//             suffix: <i className='ri-external-link-line text-xl' />
//           },
//           {
//             icon: <i className='ri-menu-2-line' />,
//             type: 'submenu',
//             label: 'Menu Levels',
//             children: [
//               { type: 'item', label: 'Menu Level 2', href: '/card-basic' },
//               {
//                 type: 'submenu',
//                 label: 'Menu Level 2',
//                 children: [
//                   { type: 'item', label: 'Menu Level 3' },
//                   { type: 'item', label: 'Menu Level 3' }
//                 ]
//               }
//             ]
//           },
//           { type: 'item', label: 'Disabled Menu', disabled: true }
//         ]
//       }
//     ]
//   }
// ]