import type { Register } from 'claude-code'

import { spiralSvg } from './spiral'
import { flowSvg } from './svgflow'

// About how many CSS pixels one column of the desktop app's prompt area is
const PX_PER_COLUMN = 8

export const register: Register = on => {
  // A purple pixel flow above the prompt. Desktop only: the terminal draws nothing extra.
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.surface !== 'desktop' || e.props.hasSurvey) return next(e)
    const { Box, Svg } = $.ui.resolve(e)
    const width = e.props.bodyColumns * PX_PER_COLUMN
    return (
      <Box key="pixel-pulse" width={e.props.bodyColumns} justifyContent="flex-end">
        <Svg source={flowSvg(width)} alt="purple pixel flow" isInteractive width={width} height={20} />
      </Box>
    )
  }).catch(($, e, next) => next(e))

  // A purple pixel spiral in place of the working spinner, with the same words beside it
  on('ui.render', { component: 'Spinner' }, async ($, e, next) => {
    if (e.surface !== 'desktop') return next(e)
    const { Box, Svg, Text } = $.ui.resolve(e)
    return (
      <Box flexDirection="row" alignItems="center" gap={1}>
        <Svg source={spiralSvg()} alt="working" isInteractive width={18} height={18} />
        <Text dimColor>{`${e.props.message ?? e.props.word}${e.props.suffix}`}</Text>
      </Box>
    )
  }).catch(($, e, next) => next(e))
}
