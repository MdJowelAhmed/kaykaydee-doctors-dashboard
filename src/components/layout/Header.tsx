import { useNavigate } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { toggleTheme, } from '@/redux/slices/uiSlice'
import { logout } from '@/redux/slices/authSlice'
import { NotificationPreviewDialog } from '@/components/layout/NotificationPreviewDialog'
import { useState } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { cn } from '@/utils/cn'
// const routeTitles: Record<string, string> = {
//   '/dashboard': 'Dashboard',
//   '/my-appointments': 'My Appointments',
//   '/my-patients-list': 'My Patients List',
//   '/schedule': 'Schedule',
//   '/availability': 'Availability',
//   '/zealth-ai': 'AI Manager',
//   '/cars': 'Car List',
//   '/my-listing': 'My Listing',
//   '/booking-management': 'Booking Management',
//   '/calender': 'Calendar',
//   '/transactions-history': 'Transactions History',
//   '/reviews-ratings': 'Reviews & Ratings',
//   '/notification': 'Notification',
//   '/subscription-packages': 'Subscription Package',
//   '/support': 'Support',
//   '/client-management': 'Client Management',
//   '/agency-management': 'Agency Management',
//   '/users': 'User Management',
//   '/controller': 'Controller',
//   '/products': 'Product Management',
//   '/categories': 'Category Management',
//   '/settings/profile': 'Profile Settings',
//   '/settings/password': 'Change Password',
//   '/settings/terms': 'Terms & Conditions',
//   '/settings/privacy': 'Privacy Policy',
//   '/settings/about-us': 'About Us',
//   '/settings/faq': 'FAQ',
// }

// function titleForPath(pathname: string): string {
//   if (routeTitles[pathname]) return routeTitles[pathname]
//   const prefix = Object.keys(routeTitles)
//     .filter((k) => k !== '/')
//     .sort((a, b) => b.length - a.length)
//     .find((route) => pathname.startsWith(route))
//   return prefix ? routeTitles[prefix] : 'Dashboard'
// }

export function Header() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { theme } = useAppSelector((state) => state.ui)
  // const { user } = useAppSelector((state) => state.auth)
  // const location = useLocation()
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // const pageTitle = titleForPath(location.pathname)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      dispatch(logout())
      navigate('/auth/login')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className='bg-background  p-2 fixed top-0 left-0 right-0 h-[72px]'>
      <header
        className="fixed left-0 right-0 top-0 z-[100] mx-5 mt-4 h-[72px] rounded-2xl bg-card shadow-md backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="mx-auto flex h-full w-full max-w-[1920px] items-center justify-between gap-3 px-4 sm:px-5 lg:px-6">
          <div className="text-primary text-white font-bold text-lg">
            <img src="/assets/logo2.png" alt="Booking Dashboard" className="h-7 w-40" />
            {/* <img src="/assets/logo3.png" alt="Booking Dashboard" className="h-8 w-20 object-contain" /> */}
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => dispatch(toggleTheme())}
                  className={cn(
                    'relative h-8 w-[72px] rounded-full p-1 transition-colors border ',
                    theme === 'dark' ? 'bg-[#414141]' : 'bg-[#414141]'
                  )}
                  aria-label="Toggle theme"
                  aria-pressed={theme === 'dark'}
                >
                  <span
                    className={cn(
                      'absolute  h-8 w-8 rounded-3xl bg-white shadow-sm transition-all duration-200',
                      theme === 'dark' ? 'left-[38px]' : 'left-0'
                    )}
                  />
                  <span className="relative z-10 flex w-full items-center justify-between px-1">
                    <Sun
                      className={cn(
                        'h-5 w-5 transition-colors',
                        theme === 'light' ? 'text-[#111827]' : 'text-[#8f949b]'
                      )}
                    />
                    <Moon
                      className={cn(
                        'h-5 w-5 transition-colors',
                        theme === 'dark' ? 'text-[#1f3f69]' : 'text-[#d0d4db]'
                      )}
                    />
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </TooltipContent>
            </Tooltip>

            <NotificationPreviewDialog />

            {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-10 w-10 rounded-full border-border/80 bg-background/50 p-0"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-primary text-sm font-medium text-primary-foreground">
                    {getInitials(user?.firstName, user?.lastName)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {user ? `${user.firstName} ${user.lastName}` : 'Admin User'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email || 'admin@example.com'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                Appearance
              </DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={theme}
                onValueChange={(v) => dispatch(setTheme(v as 'light' | 'dark'))}
              >
                <DropdownMenuRadioItem value="light" className="text-sm">
                  Light
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark" className="text-sm">
                  Dark
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/settings/profile')}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings/password')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setLogoutDialogOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
          </div>
        </div>
        <ConfirmDialog
          open={logoutDialogOpen}
          onClose={() => setLogoutDialogOpen(false)}
          onConfirm={handleLogout}
          onSuccess={() => setLogoutDialogOpen(false)}
          title="Confirm logout"
          description="Are you sure you want to log out?"
          confirmText="Logout"
          cancelText="Cancel"
          variant="danger"
          isLoading={isLoggingOut}
        />
      </header>
    </div>
  )
}
