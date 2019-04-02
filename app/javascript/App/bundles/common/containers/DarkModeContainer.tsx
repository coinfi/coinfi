import * as React from 'react'
import DarkModeToggle from '~/bundles/common/components/DarkModeToggle'
import ThemeContext, {
  ThemeProvider,
} from '~/bundles/common/contexts/ThemeContext'

interface Props {
  user: any
}

function DarkModeContainer({ user }: Props) {
  return (
    <ThemeProvider user={user}>
      <ThemeContext.Consumer>
        {({ isDarkMode, toggleTheme }) => (
          <DarkModeToggle
            isDarkMode={isDarkMode}
            onChange={toggleTheme}
            standAlone={true}
          />
        )}
      </ThemeContext.Consumer>
    </ThemeProvider>
  )
}

export default DarkModeContainer
