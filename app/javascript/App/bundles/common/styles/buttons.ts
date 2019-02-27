import {
  aqua,
  white,
  black87,
  gray,
  midnight,
  darkSkyBlue,
  white12,
  white70,
  lightGray,
  darkGray,
} from './colors'
import { CSSProperties } from '@material-ui/core/styles/withStyles'

export const btnBase = (theme) =>
  ({
    display: 'inline-block',
    textTransform: 'uppercase',
    textDecoration: 'none',
    fontSize: '0.8rem',
    fontWeight: 700,
    lineHeight: 1,
    padding: `${theme.spacing.unit * 2.4}px ${theme.spacing.unit * 4}px`,
    borderRadius: '2px',
    fontFamily: theme.typography.fontFamily,
    transition: 'all 0.2s',
    WebkitTransition: 'all 0.2s',
    cursor: 'pointer',
    '&button': {
      cursor: 'pointer !important',
    },
  } as CSSProperties)

export const btn = (theme) =>
  ({
    ...btnBase(theme),
    border: 'none',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
  } as CSSProperties)

export const btnXs = (theme) =>
  ({
    fontSize: '0.6rem',
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 1.4}px`,
  } as CSSProperties)

export const btnSm = (theme) =>
  ({
    fontSize: '0.75rem',
    padding: `${theme.spacing.unit * 1.5}px ${theme.spacing.unit * 3}px`,
  } as CSSProperties)

export const btnLg = (theme) =>
  ({
    fontSize: '0.9rem',
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 5}px`,
  } as CSSProperties)

export const btnBlue = {
  backgroundColor: aqua,
  color: white,
  '&:hover': {
    boxShadow: '0 2px 10px rgba(14, 151, 255, 0.4)',
    WebkitBoxShadow: '0 2px 10px rgba(14, 151, 255, 0.4)',
  },
} as CSSProperties

export const btnBlueOutline = {
  backgroundColor: 'inherit',
  color: aqua,
  borderColor: aqua,
  borderStyle: 'solid',
  borderWidth: '1px',
  '&:hover': {
    boxShadow: 'inset 0 0 10px rgba(14, 151, 255, 0.4)',
    WebkitBoxShadow: 'inset 0 0 10px rgba(14, 151, 255, 0.4)',
  },
} as CSSProperties

// TODO: Fix boxShadow colors
export const btnBlueDark = {
  backgroundColor: darkSkyBlue,
  color: black87,
  '&:hover': {
    boxShadow: '0 2px 10px rgba(14, 151, 255, 0.2)',
    WebkitBoxShadow: '0 2px 10px rgba(14, 151, 255, 0.2)',
  },
} as CSSProperties

export const btnWhite = {
  backgroundColor: white,
  color: black87,
  boxShadow: `inset 0 0 1px ${gray}`,
  WebkitBoxShadow: `inset 0 0 1px ${gray}`,
} as CSSProperties

export const btnWhiteDark = {
  backgroundColor: midnight,
  color: white70,
  boxShadow: `inset 0 0 1px ${white12}`,
  WebkitBoxShadow: `inset 0 0 1px ${white12}`,
} as CSSProperties

export const btnGray = {
  backgroundColor: lightGray,
  color: darkGray,
} as CSSProperties

export const btnGrayDark = {
  backgroundColor: darkGray,
  color: lightGray,
} as CSSProperties
