import type {BsButtonProps} from './index.type'

export const BS_BUTTON_DEFAULTS: Required<Pick<BsButtonProps, 'variant' | 'size' | 'disabled' | 'fullWidth' | 'type'>> =
  {
    variant: 'primary',
    size: 'md',
    disabled: false,
    fullWidth: false,
    type: 'button'
  }
