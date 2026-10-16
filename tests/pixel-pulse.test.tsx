import { expect, test } from 'claude-code/testing'

test('draws the pixel flow above the prompt on desktop', async ($, on) => {
  on('ui.render', () => null as never)
  const ui = await $.ui.mount({ plugin: 'pixel-pulse', surface: 'desktop', component: 'AbovePrompt', props: { bodyColumns: 100 } as never })
  const flow = await ui.find({ type: 'Svg' })
  expect(flow).toBeDefined()
})

test('draws the spiral and keeps the spinner words on desktop', async ($, on) => {
  on('ui.render', () => null as never)
  const ui = await $.ui.mount({
    plugin: 'pixel-pulse',
    surface: 'desktop',
    component: 'Spinner',
    props: { word: 'Thinking', message: null, suffix: '…', mode: 'thinking' },
  })
  expect(await ui.find({ type: 'Svg' })).toBeDefined()
  expect((await ui.find({ type: 'Text' }))?.text).toBe('Thinking…')
})

test('leaves the terminal spinner alone', async ($, on) => {
  // stands for Claude Code's own spinner
  on('ui.render', ($, e) => {
    const { Text } = $.ui.resolve(e)
    return <Text>engine spinner</Text>
  })
  const ui = await $.ui.mount({
    plugin: 'pixel-pulse',
    surface: 'terminal',
    component: 'Spinner',
    props: { word: 'Thinking', message: null, suffix: '…', mode: 'thinking' },
  })
  expect(await ui.find({ type: 'Svg' })).toBeUndefined()
})
